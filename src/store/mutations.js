const ADD_ITEMNUM = 'ADD_ITEMNUM'
const REMBER_ANSWER = 'REMBER_ANSWER'
const REMBER_TIME = 'REMBER_TIME'
const INITIALIZE_DATA = 'INITIALIZE_DATA'
const SET_ONLINEPLAYERS = 'SET_ONLINEPLAYERS'
const SET_USERNAME = 'SET_USERNAME'
const SET_ANOTHER = 'SET_ANOTHER'

const STAFF_UPDATEWEBSOCKET = 'STAFF_UPDATEWEBSOCKET'
const STAFF_SEND = 'STAFF_SEND'

const PRIFIX_TIMER = 'PRIFIX_TIMER'

const SET_ITEMDETAIL = 'SET_ITEMDETAIL'
const SET_FINALSCORE = 'SET_FINALSCORE'
const SET_ANSWERTIME = 'SET_ANSWERTIME'
const SET_otherScore = 'SET_otherScore'

const ISWIN = 'ISWIN'

export default {
	//点击进入下一题
	[ADD_ITEMNUM](state, num) {
		state.itemNum += num;
	},
	//记录答案
	[REMBER_ANSWER](state, id) {
		state.answerid.push(id);
	},
	/*
	记录做题时间
	 */
	[REMBER_TIME](state) {
		state.timer = setInterval(() => {
			state.allTime++;
		}, 1000)
	},
	/*
	初始化信息，
	 */
	[INITIALIZE_DATA](state) {
		state.itemNum = 1;
		state.allTime = 0;
		state.answerid = [];
	},
    [SET_ONLINEPLAYERS](state,arr){
	    state.onlinePlayers = arr;
    },
    [SET_USERNAME](state,name){
        state.USERNAME = name;
    },
    [SET_ANOTHER](state,name){
        state.ANOTHER = name;
    },
	[STAFF_UPDATEWEBSOCKET](state, websock) {
        state.stompClient = websock
    },
    [STAFF_SEND](state, text) {
        state.stompClient.send(text)
	},	
	[PRIFIX_TIMER](state, timer) {
		state.pri_timer = timer;
	},
    [SET_ITEMDETAIL](state,itemDetail){
        state.itemDetail = itemDetail;
    },
    [SET_FINALSCORE](state,name){
        state.finalScore = name;
    },
    [SET_ANSWERTIME](state,name){
        state.answerTime = name;
    },
    [ISWIN](state,name){
        state.isWin = name;
    },
    [SET_otherScore](state,name){
        state.otherScore = name;
    },
}