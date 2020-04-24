<template>
	<div class="panel">
		<button @click="sendMsg">test1</button>
		<button @click="$sendMessage('hahaha')">test2</button>
		<button>test3</button>
		<button>test4</button>
		<button>test5</button>
		<button>test6</button>
		<button>test7</button>
	</div>
</template>

<script>
  
  import { sendMessage } from './message';
  
  export default {
    name: 'App',
    mounted() {
  
    },
    methods: {
      sendMsg() {
        this.$sendMessage('sdfdsfkldsjfjdskl');
        sendMessage('1231312');
      },
    },
  };
</script>

<style scoped lang="less">
	.panel {
		position: fixed;
		bottom: 0;
		right: 0;
		z-index: 9999999999999;
	}
</style>
