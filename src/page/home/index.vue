<template>
  	<div class="home_container">
        <div class="register" ref="register">
            <div class="title">
                <img class="title_img" src="../../images/icon-trash.png"/>
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
import { mapState, mapActions } from 'vuex'

export default {
	name: 'home',
    data(){
	    return{
            username: '',
            isShow: true
        }
    },
    computed: mapState([
        'USERNAME'
    ]),
  	components: {
  		itemcontainer
  	},
    methods: {
        ...mapActions([
            'setUserName'
        ]),
        submit(){
            let randomString = Math.floor(Math.random()*(99999-9999+1)+9999);
            this.username+= randomString; //用户名+随机数
            //设置state.USERNAME
            this.setUserName(this.username);

            self = this;//小心处理this的指向
            //建立socket，并发送用户名，获取到在线玩家后调用callback
            setTimeout(function () {
                let onlinePlayers = ["aa","bb","cc"];//在线玩家
                self.callback(onlinePlayers);
            },1000);
        },
        callback(arr){
            self.isShow = false;
            self.$refs.register.className = 'hidden';
            //设置state.onlinePlayers
            this.$store.commit('SET_ONLINEPLAYERS',arr);
        }
    },
    created(){
        
    }
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
            width: 5rem;
        }
        h1{
            color: #663300;
            margin: 0.5rem 0;
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
