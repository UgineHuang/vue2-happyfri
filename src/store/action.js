import ajax from '../config/ajax'

export default {
	addNum({ commit, state }, id) {
		//点击下一题，记录答案id，判断是否是最后一题，如果不是则跳转下一题
		commit('REMBER_ANSWER', id);
		if (state.itemNum < state.itemDetail.length) {
			commit('ADD_ITEMNUM', 1);
		}
	},
	//初始化信息
	initializeData({ commit }) {
		commit('INITIALIZE_DATA');
	},
    setUserName({ commit }, name) {
        commit('SET_USERNAME', name);
    },
    setAnother({commit},name){
        commit('SET_ANOTHER', name);

    },
    setItemDetail({commit},itemDetail){
        commit('SET_ITEMDETAIL', itemDetail);

    },
    setFinalScore({commit},itemDetail){
        commit('SET_FINALSCORE', itemDetail);

    },
    setAnswerTime({commit},itemDetail){
        commit('SET_ANSWERTIME', itemDetail);

    },
	connectWebsocket ({ commit, state },callback) {
        let url ="ws://47.100.36.39:8123/ws"
        state.stompClient = Stomp.client(url);
        // 定义客户端的认证信息,按需求配置
        let headers = {
        };
        // 向服务器发起websocket连接
        state.stompClient.connect({'Access-Control-Allow-Origin':"*"},(frame) => {
            console.log('连接成功');
            // state.stompClient.subscribe('/topic/game', (msg) => { // 订阅服务端提供的某个topic
            //     console.log('广播成功');
            //     console.log(JSON.parse(msg.body));  // msg.body存放的是服务端发送给我们的信息
            //     let mess = JSON.parse(msg.body);
            //     if(mess.type='ADD_USER'){
            //
            //     }else if(mess.type='CHOOSE_USER'){
            //
            //     }else if(mess.type='DO_EXAM'){
            //
            //     }
            // });
        }, (err) => {
            // 连接发生错误时的处理函数
            console.log('失败');
            console.log(err);
        });
        commit('STAFF_UPDATEWEBSOCKET', state.stompClient)
        // 只有定义了onopen方法，才能继续实现接收消息，即在使用的地方调用onmessage方法。
        state.stompClient.onopen = function () {
        }
	},
	setPritimer({ commit },timer){
		commit('PRIFIX_TIMER', timer)
	}
}