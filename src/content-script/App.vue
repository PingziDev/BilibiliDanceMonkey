<template>
	<div class="panel">
		<div v-if="!config">获取配置中...</div>
		<div v-else>
			<button @click="show=!show" class="panel-toggle">扒舞</button>
			<div v-show="show">
				<div>
					<button @click="goToVideo(k)" v-for="(i,k) in list">
						{{i}}
					</button>
				</div>
				<div v-if="video">
					<control></control>
				</div>
				<div v-else>
					这个页面暂不支持扒舞猴子哦~
				</div>
			</div>
		</div>
	</div>
</template>

<script>
  
  import { getVideoDom } from '../utils/bilibili';
  import Control from './components/Control';
  import { mapState } from 'vuex';
  import { sendMessage } from './message';
  import { MessageType } from '../utils/types';
  
  export default {
    name: 'App',
    components: { Control },
    data() {
      return {
        show: false,
        video: undefined,
      };
    },
    computed: {
      ...mapState(['config', 'list']),
  
    },
    watch: {
  
      vid:function(now,old) {
        console.log('nowOld===',now,old)
        this.$forceUpdate()
      }
    },
    mounted() {
      this.video = getVideoDom();
    },
    methods: {
      goToVideo(vid) {
        sendMessage({ type: MessageType.openTab, value: 'https://www.bilibili.com/video/' + vid });
      },
    },
  };
</script>

<style scoped lang="less">
	* {
		font-size: 20px;
	}
	.panel {
		position: fixed;
		bottom: 0;
		right: 0;
		z-index: 9999999999999;
		background-color: #fff;
	}
</style>
