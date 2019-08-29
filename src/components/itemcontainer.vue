<template>
  	<section>
    	<header class="top_tips" v-if="fatherComponent == 'home'">
    		<span class="num_tip">来呀！</span>
    	</header>
    	<div v-if="fatherComponent == 'home'">
    		<div class="home_logo item_container_style"></div>
            <div class="players" v-loading="isLoading">
                <h3 @click="websocket()">请选择以下玩家对战</h3>
                <ul>
                    <li v-for="(item, index) in onlinePlayers" @click="choosePlayer(index,item)">
                        <span class="option_detail" v-bind:class="{'choosed':choosedPlayer==item}">{{item}}</span>
                    </li>
                </ul>
            </div>
    		<div @click="loading()" class="start button_style" ></div>
    	</div>
    	<div v-if="fatherComponent == 'item'" >
    		<div class="item_back item_container_style">
    			<div class="item_list_container" v-if="itemDetail.length > 0">
                    <vue-progress-bar></vue-progress-bar>
                    <div class="scoreArea">
                        <countTo :startVal='m_startVal' :endVal='myScore' :duration='3000' :prefix='aaaa'></countTo>
                        <countTo :startVal='o_startVal' :endVal='anOtherScore' :duration='3000' :prefix='bbbb'></countTo>
                    </div>
    				<div class="item_title">{{itemDetail[itemNum-1].topic_name}}</div>
                    <ul v-loading="hasAnswered">
                        <li  v-for="(item, index) in itemDetail[itemNum-1].topic_answer" @click="choosed(index, item.topic_answer_id,item.is_standard_answer)" class="item_list" v-bind:class="{'has_choosedlist':choosedNum==index}">
                            <span class="" v-bind:class="{'has_choosed':choosedNum==index}"></span>
                            <!--<span class="option_detail">{{item.answer_name}}</span>-->
                            <img style="width: 80%" src="../images/ganlaji.png" v-if="index == 2">
                            <img style="width: 80%" src="../images/kehuishouwu.png" v-if="index == 1">
                            <img style="width: 80%" src="../images/shilaji.png" v-if="index == 3">
                            <img style="width: 80%" src="../images/youhailaji.png" v-if="index == 0">
                        </li>
                    </ul>
    			</div>
    		</div>
    		<span class="next_item button_style" @click="nextItem" v-if="itemNum < itemDetail.length"></span>
    		<span class="submit_item button_style" v-else @click="submitAnswer"></span>
    	</div>
        <div class="user_name_label_position">
            <span>我的昵称：{{USERNAME}}</span>
        </div>
  	</section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import countTo from 'vue-count-to';

export default {
	name: 'itemcontainer',
    components: { countTo },
    data() {
		return {
			itemId: null, //题目ID
			choosedNum: null, //选中答案索引
			choosedId:null, //选中答案id
            choosedPlayer: null,
            myScore: 0,
            anOtherScore: 0,
            m_startVal: 0,
            o_startVal: 0,
            isLoading: false,
            hasAnswered:false,
            tempScore:0,
            isOverTime: null,
            aaaa: '我方分数：',
            bbbb: '对方分数：',
            count:0
		}
	},
  	props:['fatherComponent'],
  	computed: mapState([
	  	'itemNum', //第几题
  		'level', //第几周
  		'itemDetail', //题目详情
  		'timer', //计时器
        'answerTime',
        'onlinePlayers',
        'ANOTHER',
        'USERNAME',
        'stompClient',
        'pri_timer',
]),
  	methods: {
  		...mapActions([
  			'addNum', 'initializeData','setAnother','setItemDetail','setFinalScore','setAnswerTime',
            'connectWebsocket', 'setPritimer','setIsWin','setOther'
  		]),
  		//点击下一题
  		nextItem(){
            this.hasAnswered = false;
  			if (this.choosedNum !== null) {
	  			this.choosedNum = null;
	  			//保存答案, 题目索引加一，跳到下一题
	  			this.addNum(this.choosedId);
                this.$Progress.start();
                this.setAnswerTime(new Date().getTime());
  			}else{
  				alert('您还没有选择答案哦')
  			}
  		},
  		//索引0-3对应答案A-B
	  	chooseType: type => {
	  		switch(type){
	  			case 0: return 'A';
	  			case 1: return 'B';
	  			case 2: return 'C';
	  			case 3: return 'D';
	  		}
	  	},
	  	//选中的答案信息
	  	choosed(type,id,isStandardAnswer){
            this.hasAnswered = true;
	  		this.choosedNum = type;
	  		this.choosedId = id;
	  		this.computeScore(isStandardAnswer);
            this.$Progress.finish();
            console.log(this.myScore);
            this.stompClient.send("/app/game.do_exam", {},
                JSON.stringify({type: 'DO_EXAM', content: this.tempScore, sender: this.USERNAME}));
	  	},
	  	//到达最后一题，交卷，请空定时器，跳转分数页面
	  	submitAnswer(){
	  		if (this.choosedNum !== null) {
	  			this.addNum(this.choosedId)
                this.setFinalScore(this.myScore)
	  			clearInterval(this.timer)
                let self = this;
	  			if(this.count<2){
                    setTimeout(self.goToScore,5000);
                }else{
	  			    self.goToScore();
                }
  			}else{
  				alert('您还没有选择答案哦')
  			}
	  	},
        goToScore(){
	  	    debugger;
            if(this.myScore > this.anOtherScore) {
                this.setOther(this.anOtherScore);
                this.setIsWin(true)
            }
            this.$router.push('score')
        },
        //选择玩家
        choosePlayer(i, aother){
	  	    this.choosedPlayer = aother;
            this.setAnother(aother);
//            console.log(this.USERNAME)
//            console.log(this.ANOTHER)
        },
        loading(){
            this.isLoading = true;
            this.websocket();
            this.stompClient.send("/app/game.choose_user", {},
                JSON.stringify({type: 'CHOOSE_USER', content: this.ANOTHER, sender: this.USERNAME}));
        },
        //跳转对战页面
        goToPlay(){
            this.isLoading = false;
            this.$router.push('item');
        },
        //计算得分
        computeScore(isStandardAnswer){
            //计算用户得分
            var time = new Date().getTime();
            this.setAnswerTime(time - this.answerTime);
            if(isStandardAnswer){
                if(this.answerTime<4000){
                    this.startVal = this.myScore
                    this.tempScore = 10;
                    this.myScore +=10;
                }else if(this.answerTime<10000){
                    this.startVal = this.myScore
                    this.tempScore = 8;
                    this.myScore +=8;
                }else{
                    this.tempScore = 0;
                }
            }else{
                this.tempScore = 0;
            }
        },
        websocket(){
            this.stompClient.subscribe('/topic/game', (msg) => { // 订阅服务端提供的某个topic
                console.log('广播成功');
                let mess = JSON.parse(msg.body);
                if(mess.chatMessage.type=='ADD_USER'){
                    console.log('ADD_USER');
                }else if(mess.chatMessage.type=='CHOOSE_USER'){
                    console.log('CHOOSE_USER'+mess.chatMessage.receiver.indexOf(this.USERNAME));
                    console.log();
                    if(mess.chatMessage.receiver.indexOf(this.USERNAME) != -1){
                        let itemDetail = eval(mess.chatMessage.content);
                        this.setItemDetail(itemDetail);
                        this.goToPlay();
                    }
                }else if(mess.chatMessage.type=='DO_EXAM'){
                    console.log('DO_EXAM'+mess.chatMessage.receiver.indexOf(this.USERNAME));
                    if(mess.chatMessage.receiver.indexOf(this.USERNAME) != -1){
                        this.o_startVal = this.anOtherScore;
                        this.anOtherScore += parseInt(mess.chatMessage.content);
                        this.count++;
                    }
                }
            });
        }
    },
	created(){
		//初始化信息
		if(this.fatherComponent == 'home') {
			this.initializeData();
			//页面进来,就需要监听websocket收到的信息，只要收到匹配信息就跳转对战页面，调用goToPlay()
            let self = this;
//            self.loading();
            // setTimeout(function () {
            //     self.goToPlay();
            // },2000);
		}else{
            this.$Progress.start();
//            var self = this;
//            setTimeout(function () {
//                self.startVal = self.endVal;
//                self.endVal = 50;
//            },5000)
        }
	},
    mounted(){
        this.setAnswerTime(new Date().getTime());
        if(this.stompClient){
            this.websocket();
        }else{

        }
    }
}
</script>

<style lang="less">
	.top_tips{
		background: url(../images/lajitong.png) no-repeat;
		z-index: 10;
        position: absolute;
        height: 5.35rem;
        width: 4.25rem;
        top: 1.5rem;
        right: 0.3rem;
        background-size: 100%;
		.num_tip{
            position: absolute;
            left: 1.5rem;
            top: 0rem;
			height: 0.7rem;
			width: 4.2rem;
			font-size: 0.6rem;
			font-family: '黑体';
			font-weight: 600;
			color: #990033;
			text-align: center;
		}
	}
	.item_container_style{
		height: 11.625rem;
		width: 13.15rem;
		background-repeat: no-repeat;
		position: absolute;
		top: 0.1rem;
		left: 1rem;
	}
	.home_logo{
		background-image: url(../images/1-2.png);
        background-size: 8rem 40%;
        background-position: left top;
        top: 2rem;
	}
	.item_back{
		background-image: url(../images/2-1.png);
		background-size: 100% 100%;
	}
	.button_style{
        display: block;
        height: 2.1rem;
        width: 4.35rem;
        background-size: 100% 100%;
        position: absolute;
        top: 16.5rem;
        left: 50%;
        margin-left: -2.4rem;
        background-repeat: no-repeat;
	}
	.start{
        background-image: url(../images/1-4.png);
    }
    .next_item{
    	background-image: url(../images/2-2.png);
    }
    .submit_item{
    	background-image: url(../images/3-1.png);
    }
    .item_list_container{
    	position: absolute;
    	height: 7.0rem;
    	/*width: 8.0rem;*/
    	top: 5.4rem;
    	left: 3rem;
		-webkit-font-smoothing: antialiased;
        ul{
            position: relative;
            left: -1rem;
        }
    }
	.item_title{
		font-size: 0.8rem;
		color: #00e;
		line-height: 0.7rem;
        position: fixed;
        top: 4rem;
        left: 0rem;
        text-align: center;
        width: 100%;
	}
	.item_list{
        font-size: 0;
        margin-top: 0.4rem;
        width: 5rem;
        display: inline-block;
        text-align: center;
        span{
            display: inline-block;
            font-size: 0.6rem;
            color: #00e;
            vertical-align: middle;
        }
        .option_style{
            height: 0.725rem;
            width: 0.725rem;
            border: 1px solid #fff;
            border-radius: 50%;
            line-height: 0.725rem;
            text-align: center;
            margin-right: 0.3rem;
            font-size: 0.5rem;
            font-family: 'Arial';
        }
        .has_choosed{
            background-color: #ffd400;
            color: #575757;
            border-color: #ffd400;
        }
        .option_detail{
            width: 7.5rem;
            padding-top: 0.11rem;
        }
	}
    .has_choosedlist{
        background-color: #ffd400;
        color: #575757;
        border-color: #ffd400;
    }
    .players{
        position: relative;
        width: 90%;
        height: 8rem;
        overflow: scroll;
        margin: 5rem auto;
        h3,ul{
            text-align: center;
        }
        span{
            display: inline-block;
            width: 50%;
        }
        .choosed{
            background-color: #ffd400;
            color: #575757;
            border-color: #ffd400;
            border-radius: 0.3rem ;
        }
    }
    .scoreArea{
        position: fixed;
        top: 2.5rem;
        left: 1.5rem;
        width: 13rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .user_name_label_position{
        position: fixed;
        top: 25rem;
        left: 3.5rem;
    }
</style>
