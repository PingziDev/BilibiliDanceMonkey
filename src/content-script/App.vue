<template>
	<div class="panel">
		<button @click="show=!show" class="panel-toggle">扒舞</button>
		<div v-if="video">
			<control-item
					v-for="(v,i) in items"
					:key="i"
					:video="video"
					:defaultValues="v"
					@play="playItem(i,...arguments)"
					@del="delItem(i)"
					@add="addItem"
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
</template>

<script>
  
  import { getVideoDom } from '../utils/bilibili';
  import Keymap from './components/Keymap';
  import ControlItem from './components/ControlItem';
  import { FASTER, SET_SPEED, SLOWER } from '../store/mutation-types';
  import { mapState } from 'vuex';
  import { round } from '../utils/utils';
  
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
      };
    },
    computed: {
      ...mapState(['speed']),
    
    },
    watch: {
      speed: function(now) {
        console.log('now===', now);
        this.setSpeed(now);
      },
    },
    mounted() {
      this.video = getVideoDom();
  
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        // console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
        if (typeof request === 'string') {
          switch (request) {
            case 'faster':
              this.$store.commit(FASTER);
              break;
            case 'slower':
              this.$store.commit(SLOWER);
              break;
            case 'speed0.5':
              this.$store.commit(SET_SPEED, 0.5);
              break;
            case 'speed1':
              this.$store.commit(SET_SPEED, 1);
              break;
            default:
          }
        }
      });
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
        this.items.push({ playing: false, start: end, end: duration });
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
