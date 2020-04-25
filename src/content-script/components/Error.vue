<template>
	<div class="talkbox">
		<div class="me"></div>
		<slot></slot>
	</div>
</template>

<script>
  
  export default {
    name: 'error',
  };
</script>

<style scoped lang="less">
	
	.talkbox {
		
		.me {
			padding: 30px;
			background-image: url("chrome-extension://__MSG_@@extension_id__/assets/me.png");
			background-size: 60px 100%;
			background-repeat: no-repeat;
			position: absolute;
			top: 0;
			right: 140px;
			border-radius: 50%;
		}
		
		background-color: #f2f2f2;
		border: 1px solid #eee;
		border-radius: 15px;
		padding: 30px;
		margin-right: 15px;
		margin-top: 40px;
		
	}
	
	.info {
		font-size: 14px;
		line-height: 20px;
		
		a {
			text-decoration: underline;
			color: #f27991;
		}
	}
</style>
