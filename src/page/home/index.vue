<template>
  	<div class="home_container">
        <div class="register" ref="register">
            <div class="title">
                <img class="title_img" src="../../images/lajitong1.png"/>
                <h1>你是什么垃圾？</h1>
            </div>
            <form>
                <input name="username" v-model="username" placeholder="请输入你的呢称"/>
                <img src="../../images/anniu.png" class="submit" @click="submit()">
            </form>
        </div>
        <itemcontainer father-component="home" :class="{'hidden':isShow}"></itemcontainer>
    </div>
</template>

<script>
import itemcontainer from '../../components/itemcontainer'

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { mapState, mapActions } from 'vuex'

export default {
	name: 'home',
    data(){
	    return{
            username: '',
            isShow: true
        }
    },
  	components: {
  		itemcontainer
  	},
    computed: mapState([
        'stompClient', 'pri_timer', 'USERNAME'
        ]),

    created(){
        document.body.style.backgroundImage = 'url(./static/img/4-1.jpg)';
    },
    methods: {
        ...mapActions([
            'connectWebsocket', 'setPritimer', 'setUserName'
        ]),
        initWebSocket(callback) {
            this.connectWebsocket();
            let self= this;
            // 断开重连机制,尝试发送消息,捕获异常发生时重连
            let tempTimer = setInterval(() => {
                try {
                    self.stompClient.send("testrrr");
                } catch (err) {
                    console.log("断线了: " + err);
                    self.connectWebsocket();
                }
            }, 10000);
            this.setPritimer(tempTimer);
        },

        submit(){
            this.initWebSocket();

            let randomString = Math.floor(Math.random()*(99999-9999+1)+9999);
            this.username+= randomString; //用户名+随机数
            this.setUserName(this.username);
            let self = this;//小心处理this的指向

            setTimeout(function () {
                    self.stompClient.subscribe('/topic/game', (msg) => { // 订阅服务端提供的某个topic
                        console.log('广播成功');
                        let mess = JSON.parse(msg.body);
                        console.log(mess);
                        if(mess.chatMessage.type=='ADD_USER'){
                            console.log('ADD_USER'+mess.chatMessage.receiver.indexOf(self.USERNAME));
                            if(mess.chatMessage.receiver.indexOf(self.USERNAME) != -1){
                                let onlinePlayers = eval(mess.chatMessage.content);
                                self.callback(onlinePlayers);
                            }else{
                                let onlinePlayers = [];
                                self.callback(onlinePlayers);
                            }
                        }else if(mess.chatMessage.type=='CHOOSE_USER'){
                            console.log('CHOOSE_USER');
                        }else if(mess.chatMessage.type=='DO_EXAM'){

                        }
                    });
                    self.stompClient.send("/app/game.add_user", {},
                    JSON.stringify({type: 'ADD_USER', content: self.username, sender: self.username}));
            },1000);

            //建立socket，并发送用户名，获取到在线玩家后调用callback
//             setTimeout(function () {
//                 self.callback(onlinePlayers);
//             },10000);
        },
        callback(arr){
            this.isShow = false;
            this.$refs.register.className = 'hidden';
            //设置state.onlinePlayers
            this.$store.commit('SET_ONLINEPLAYERS',arr);
        }
    },
    mounted(){}
}
</script>

<style lang="less" scoped>
    .home_container{
        padding-top: 3rem;
    }
    .home_container .register{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .register .title{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .title_img{
            width: 11rem;
            margin-left: -2rem;
        }
        h1{
            color: #663300;
            margin: 0.5rem 0;
            margin-left: 1.5rem;
        }
    }
    .register form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        input{
            display: inline-block;
            padding-left: 32px;
            width: 9rem;
            height: 1.5rem;
            line-height: 1.5;
            border: 1px solid #990033;
            border-radius: 4px;
            color: #990033;
            margin: 0.5rem 0;
            font-weight: 900;
            font-size: large;
        }
        .submit{
            width:3rem;
        }
    }
    .hidden{
        display: none;
    }
</style>
