<template>
	<div class="panel">
		<div v-if="!config">获取配置中...</div>
		<div v-else>
			<button @click="show=!show" class="panel-toggle">扒舞</button>
			<div v-if="video&&items&&ratio">
				<control-item
						v-for="(v,i) in items"
						:key="i"
						:video="video"
						:ratio="ratio"
						:defaultValues="v"
						@start="val=>v.start=val"
						@end="val=>v.end=val"
						@play="playItem(i,...arguments)"
						@del="delItem(i)"
						@add="addItem(i)"
						@snap="val=>v.canvasStr=val"
				></control-item>
			</div>
			<div v-show="show">
				<button @click="togglePlay()">{{playing?'播放中':'暂停中'}}</button>
				<button @click="save">保存这只扒舞</button>
				<button @click="clear">清空数据</button>
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
  
  import { getVid, getVideoDom } from '../utils/bilibili';
  import Keymap from './components/Keymap';
  import ControlItem from './components/ControlItem';
  import { mapState } from 'vuex';
  
  import { clearItems, getItems, saveItems } from '../utils/storage';
  
  export default {
    name: 'App',
    components: { Keymap, ControlItem },
    data() {
      return {
        show: true,
        playing: false,
        video: undefined,
        timer: undefined,
        items: undefined,
        duration: false,
        // snapshot
        ratio: false,
      };
    },
    computed: {
      ...mapState(['speed', 'config']),
      vid() {
        return getVid();
      },
      defaultItems() {
        return [
          {
            start: this.video.currentTime,
            end: this.duration,
            playing: false,
            canvasStr: false,
          }];
      },
    },
    watch: {
      speed: function(now) {
        this.setSpeed(now);
      },
    },
    mounted() {
      this.video = getVideoDom();
  
      // get ratio
      this.video.addEventListener('loadedmetadata', () => {
        this.ratio = this.video.videoWidth / this.video.videoHeight;
        this.duration = this.video.duration;
  
        // get default data
        this.items = (getItems(this.vid) || this.defaultItems).map(i => {
          i.playing = false;
          return i;
        });
        
      }, false);
    },
    methods: {
      togglePlay(playing) {
        this.playing = playing === undefined ? !this.playing : playing;
        this.playing ? this.video.play() : this.video.pause();
      },
      setSpeed(speed) {
        this.video.playbackRate = speed;
      },
      delItem(key) {
        this.items.splice(key, 1);
      },
      addItem(index) {
        const duration = this.video.duration;
        const currentTime = this.video.currentTime;
    
        if (currentTime >= duration) {
          return;
        }
        // set end for current item
    
        if (currentTime > this.items[index].start) {
          console.log('currentTime===', currentTime);
          this.items[index].end = currentTime;
        }
        // add a new item which start with  current time
        const { bufferTime } = this.config;
        const newItem = { playing: false, start: Math.max(0, currentTime), end: duration, canvasStr: '' };
        this.items.push(newItem);
        this.playItem(this.items.length - 1, newItem.start, newItem.end);
      },
      playItem(index, start, end) {
        this.items.forEach((v, i) => {
          v.playing = i === index;
        });
        this.video.currentTime = start;
        this.togglePlay(true);
        if (this.timer) {
          clearInterval(this.timer);
        }
        if (end) {
          this.timer = setInterval(() => {
            this.video.currentTime = start;
          }, (end - start) * 1000);
        }
  
      },
      save() {
        console.log('thisVid===', this.vid);
        saveItems(this.vid, this.items);
      },
      clear() {
        this.items = this.defaultItems;
        clearItems(this.vid);
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
