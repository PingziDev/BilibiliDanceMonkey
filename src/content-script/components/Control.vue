<template>
	<div  class="flex col center">
		<div v-if="showList">
			<button @click="goToVideo(k)" v-for="(i,k) in list">
				{{i}}
			</button>
		</div>
		<div class="w100"
		     v-else v-for="(v,i) in items">
			<control-item
					:key="i"
					:video="video"
					:ratio="ratio"
					:defaultValues="v"
					:duration="duration"
					@start="val=>v.start=val"
					@end="val=>v.end=val"
					@play="playItem(i,...arguments)"
					@del="delItem(i)"
					@add="addItem(i)"
					@snap="val=>v.canvasStr=val"
			></control-item>
		</div>

		
		<el-button-group style="position: absolute;bottom: 30px;">
			<el-button plain round @click="showList=true" type="primary" icon="el-icon-more" ></el-button>
			<el-button plain round @click="showList=false" type="primary" icon="el-icon-menu" ></el-button>
			<template v-if="!showList">
				<el-button plain icon="el-icon-document"  round type="primary" @click="save"></el-button>
				<el-button plain round type="primary"  @click="clear" icon="el-icon-delete"></el-button>
			</template>
		</el-button-group>
		<div>
			<h2>当前倍速: {{speed | speed}}</h2>
			<button @click="$store.commit('SET_SPEED',i*0.1)" v-for="i in 9">0.{{i}}倍速</button>
			<button @click="$store.commit('SET_SPEED',1)">原速</button>
		</div>
		<keymap></keymap>
	</div>
</template>

<script>
  
  import { getVideoDom } from '../../utils/bilibili';
  import Keymap from './../components/Keymap';
  import ControlItem from './../components/ControlItem';
  import { mapGetters, mapState } from 'vuex';
  
  import { clearItems, getItems, saveItems } from '../../utils/storage';
  import { sendMessage } from '../message';
  
  export default {
    components: { Keymap, ControlItem },
    data() {
      return {
        playing: false,
        video: undefined,
        timer: undefined,
        items: undefined,
        duration: false,
        showList: false,
        loading: false,
        // snapshot
        ratio: false,
      };
    },
    computed: {
      ...mapState(['speed', 'config', 'list']),
      ...mapGetters(['vid']),
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
      vid:function(now,old) {
        if (now != old) {
          this.getData();
        }
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      getData() {
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
      goToVideo(vid) {
        sendMessage({ type: MessageType.openTab, value: 'https://www.bilibili.com/video/' + vid });
      },
    },
  };
</script>

<style scoped lang="less">

</style>
