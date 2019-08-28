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
    methods: {
        submit(){
            self = this;
            console.log(this.username);
            let r = Math.floor(Math.random()*10+1);
            setTimeout(function () {
                self.isShow = false;
                self.$refs.register.className = 'hidden';
            },1000);
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
