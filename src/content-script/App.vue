<template>
	<div class="panel">
		<button @click="show=!show" class="panel-toggle">扒舞</button>
		<control-item v-if="video" :video="video" @play="playItem"></control-item>
		<div v-show="show">
			<button @click="sendMsg">test1</button>
			<button @click="togglePlay()">{{playing?'播放中':'暂停中'}}</button>
			<button>test7</button>
		</div>
		<keymap></keymap>
	</div>
</template>

<script>
  
  import { getVideoDom } from '../utils/bilibili';
  import Keymap from './components/Keymap';
  import ControlItem from './components/ControlItem';
  
  export default {
    name: 'App',
    components: { Keymap, ControlItem },
    data() {
      return {
        show: true,
        playing: false,
        video: undefined,
        timer: undefined,
      };
    },
    mounted() {
      this.video = getVideoDom();
    },
    methods: {
      sendMsg() {
        this.$sendMessage('sdfdsfkldsjfjdskl');
      },
      togglePlay(playing) {
        console.log('playing===', playing);
        this.playing = playing === undefined ? !this.playing : playing;
        this.playing ? this.video.play() : this.video.pause();
      },
      playItem(start, end) {
        console.log('startEnd===', start, end);
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.video.currentTime = start;
        this.togglePlay(true);
        this.timer = setInterval(() => {
          this.video.currentTime = start;
        }, (end - start) * 1000);
      },
      setSpeed(speed) {
        this.video.playbackRate = speed;
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
	}
</style>
