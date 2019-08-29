<template>
  	<div>
    	<itemcontainer father-component="item"></itemcontainer>
  	</div>
</template>

<script>
import itemcontainer from '../../components/itemcontainer'

export default {
	name: 'item',
  	components: {
   		itemcontainer
  	},
	  
    created(){
        document.body.style.backgroundImage = 'url(./static/img/4-1.jpg)';
    },
}

</script>

<style lang="less">
    

</style>
