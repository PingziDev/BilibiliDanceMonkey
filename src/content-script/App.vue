<template>
	<div class="panel">
		<div v-if="!config">获取配置中...</div>
		<div v-else>
			<button @click="show=!show" class="panel-toggle">扒舞</button>
			<div v-if="video">
				<control-item
						v-for="(v,i) in items"
						:key="i"
						:video="video"
						:ratio="ratio"
						:defaultValues="v"
						@play="playItem(i,...arguments)"
						@del="delItem(i)"
						@add="addItem"
						@snap="val=>v.canvasStr=val"
				></control-item>
			</div>
			<div v-show="show">
				<button @click="sendMsg">test1</button>
				<button @click="togglePlay()">{{playing?'播放中':'暂停中'}}</button>
				<div>
					<h2>当前倍速: {{speed | speed}}</h2>
					<button @click="$store.commit('SET_SPEED',i*0.1)" v-for="i in 9">0.{{i}}倍速</button>
					<button @click="$store.commit('SET_SPEED',1)">原速</button>
				</div>
			</div>
			<keymap></keymap>
		</div>
	</div>
</template>

<script>
  
  import { getVideoDom } from '../utils/bilibili';
  import Keymap from './components/Keymap';
  import ControlItem from './components/ControlItem';
  import { mapState } from 'vuex';
  import { round } from '../utils/utils';
  import { Commands } from '../utils/types';
  import { FASTER, SET_CONFIG, SET_SPEED, SLOWER } from '../store/mutation-types';
  import { getStorage, setStorage } from '../utils/storage';
  
  export default {
    name: 'App',
    components: { Keymap, ControlItem },
    data() {
      return {
        show: true,
        playing: false,
        video: undefined,
        timer: undefined,
        items: [{ playing: false }],
        duration: false,
        // snapshot
        ratio: 1,
      };
    },
    computed: {
      ...mapState(['speed', 'config']),
    
    },
    watch: {
      speed: function(now) {
        console.log('now===', now);
        this.setSpeed(now);
      },
    },
    mounted() {
      this.video = getVideoDom();
      this.setDefConfig();
      this.handleCommands();
      ////////////////
      this.video.addEventListener('loadedmetadata', () => {
        this.ratio = this.video.videoWidth / this.video.videoHeight;
        console.log('thisRatio===',this.ratio)
      }, false);
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
      setSpeed(speed) {
        this.video.playbackRate = speed;
      },
      delItem(key) {
        this.items.splice(key, 1);
      },
      addItem(start, end) {
        const duration = this.video.duration;
        if (round(end) == round(duration)) {
          return;
        }
        const { bufferTime } = this.config;
        const newItem = { playing: false, start: Math.max(0, end - bufferTime), end: duration };
        this.items.push(newItem);
        this.playItem(this.items.length - 1, newItem.start, newItem.end);
      },
      playItem(index, start, end) {
        this.items.forEach((v, i) => {
          v.playing = i === index;
        });
        console.log('thisItems===', this.items);
        this.video.currentTime = start;
        this.togglePlay(true);
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
          this.video.currentTime = start;
        }, (end - start) * 1000);
      },
      setDefConfig() {
        // 默认设置
        getStorage('config').then(res => {
          if (res) {
            return this.$store.commit(SET_CONFIG, res);
          }
          const config = {
            bufferTime: 4,
            captureW: 100,
          };
          setStorage('config', config);
          return this.$store.commit(SET_CONFIG, config);
        });
      },
      handleCommands() {
        // 处理bg传来的命令
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
          console.log('request===', request);
      
          if (typeof request === 'string') {
            switch (request) {
              case Commands.faster:
                this.store.commit(FASTER);
                break;
              case Commands.slower:
                this.store.commit(SLOWER);
                break;
              case Commands.speed5:
                this.store.commit(SET_SPEED, 0.5);
                break;
              case Commands.speed1:
                this.store.commit(SET_SPEED, 1);
                break;
              default:
            }
          }
        });
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
