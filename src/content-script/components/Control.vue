<template>
  <div>
    <div v-if="video" class="flex col center">
      <div class="w100" v-if="items&&items.length>0">
        <control-item
		        :key="i"
		        v-for="(v, i) in items"
		        :active="i===active"
		        :video="video"
		        :ratio="ratio"
		        :defaultValues="v"
		        :duration="duration"
		        @setItemTime="setItemTime(i,...arguments)"
		        @togglePlay="togglePlayItem(i, ...arguments)"
		        @playfromme="playItem(i,...arguments)"
		        @del="delItem(i)"
		        @add="addItem(i)"
		        @merge="merge(i,i-1)"
		        @snap="val => (v.canvasStr = val)"
        ></control-item>
      </div>
      <div v-else>
        <error>
          什么都没有哦,点击按钮
          <el-button
                  plain
                  round
                  type="primary"
                  @click="add"
                  size="mini"
                  icon="el-icon-plus"
          ></el-button>
           新建一个吧~
        </error>
      
      </div>
      
      <el-button-group class="btmbtns">
	      <el-tooltip content="保存这支扒舞~" effect="light" placement="top">
		      <el-button
                plain
                icon="el-icon-document"
                round
                type="primary"
                @click="save"
        ></el-button>
	      </el-tooltip>
	      <el-tooltip content="从当前时间新建一个片段~" effect="light" placement="top">
		
		      <el-button
                plain
                round
                type="primary"
                @click="add"
                icon="el-icon-plus"
        ></el-button>
	      </el-tooltip>
	      <el-tooltip content="删除这支扒舞~" effect="light" placement="top">
		
		      <el-button
                plain
                round
                type="primary"
                @click="clear"
                icon="el-icon-delete"
        ></el-button>
	      </el-tooltip>
      </el-button-group>
    </div>
    <div v-else>
      <error>
        这个页面暂不支持扒舞猴子哦~
      
      </error>
    </div>
  </div>
</template>

<script>
  import { getVideoDom } from '../../utils/bilibili';
  import Keymap from './../components/Keymap';
  import ControlItem from './../components/ControlItem';
  import { mapGetters, mapState } from 'vuex';
  
  import { clearItems, getItems, saveItems } from '../../utils/storage';
  import { SET_CUREENT, SET_PLAYING } from '../../store/mutation-types';
  import { round } from '../../utils/utils';
  
  export default {
  components: { Keymap, ControlItem },
  data() {
    return {
      video: undefined,
      timer: undefined,
      items: false,
      duration: false,
      showList: false,
      loading: false,
      // snapshot
      ratio: false
    };
  },
  computed: {
    ...mapState(["speed", "config", "list"]),
    playing: {
      // getter
      get: function() {
        return this.$store.state.playing;
      },
      // setter
      set: function(newValue) {
        this.$store.commit(SET_PLAYING, newValue);
      },
    },
    active: {
      get: function() {
        return this.$store.state.currentItem;
      },
      set: function(newValue) {
        this.$store.commit(SET_CUREENT, newValue);
      },
    },
    ...mapGetters(["vid"]),

  },
  watch: {
    speed: function(now) {
      this.setSpeed(now);
    },
    vid: function(now, old) {
      if (now != old) {
        this.getData();
      }
    },
    playing(now) {
      this.togglePlay(now);
    },
    active(now, old) {
      if (now !== old && this.items && this.items.length > 1) {
        if (now > this.items.length - 1) {
          now = this.items.length - 1;
        }
        const obj = this.items[now];
        this.playItem(now, obj.start, obj.end, true);
      }
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.video = getVideoDom();
  
      if (this.video) {
        // video not loaded
        if (this.video.readyState < 4) {
          this.video.addEventListener(
            'loadedmetadata',
            () => {
              this.getVideoReadyData();
            },
            false,
          );
        } else {
          // video already loaded
          this.getVideoReadyData();
        }
        
        this.video.onplay = () => {
          !this.playing ? this.playing = true : null;
        };
        this.video.onpause = () => {
          this.playing ? this.playing = false : null;
        };
        this.video.ontimeupdate = (val) => {
          // todo
        };
      }
    },
    getVideoReadyData() {
      // get ratio
      this.ratio = this.video.videoWidth / this.video.videoHeight;
      this.duration = this.video.duration;

      // get default data
      const temp = getItems(this.vid);
      if (temp) {
        temp.map(i => {
          i.playing = false;
          return i;
        });
      }
      this.items = temp;
      console.log('thisItems===', this.items);
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
    add() {
      const duration = this.video.duration;
      const currentTime = this.video.currentTime;

      if (currentTime >= duration) {
        this.$notify({ title: '超出视频时长,不能再添加片段了哟~!', type: 'error' });
        return;
      }
  
      // add a new item which start with  current time
      const newItem = {
        playing: false,
        start: Math.max(0, currentTime),
        end: duration,
        canvasStr: '',
      };
      const temp = this.items || [];
      temp.push(newItem);
      this.items = temp;
      this.playItem(this.items.length - 1, newItem.start, newItem.end);
    },
    addItem(index) {
      const duration = this.video.duration;
      const start = this.items[index].end;
  
      if (round(start) >= round(duration)) {
        this.$notify({ title: '超出视频时长,不能再添加片段了哟~!', type: 'error' });

        return;
      }
  
      // add a new item which start with  start time
      const newItem = {
        playing: false,
        start: start,
        end: duration,
        canvasStr: ""
      };
      this.items.push(newItem);
      this.playItem(this.items.length - 1, newItem.start, newItem.end);
    },
    playItem(index, start, end, playing = true) {
      this.active = index;
      if (playing) {
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
      } else {
        this.items[index].playing = false;
        this.togglePlay(false);
      }
    },
    playInterval(start, end) {
    },
    togglePlayItem(index, start, end, playing) {
      if (index !== this.active) {
        this.playItem(index, start, end);
      } else {
        console.log('playing===',playing)
        this.items[index].playing = playing;
        this.togglePlay();
      }
    },
    setItemTime(index, start, end) {
      this.items[index].start = start;
      this.items[index].end = end;
      this.active = index;
      this.items[index].playing = true;
      this.playItem(index, start, end, true);
    },
    save() {
      try {
        saveItems(this.vid, this.items);
      } catch (e) {
        console.log('e===', e);
      }
      this.$notify({ title: '保存成功!', type: 'success' });
    },
    clear() {
      this.items = false;
      clearItems(this.vid);
    },
    merge(me, last) {
      const meObj = this.items[me];
      const laObj = this.items[last];
      const newItem = { start: Math.min(meObj.start, laObj.start), end: Math.max(meObj.end, laObj.end) };
      this.setItemTime(last, newItem.start, newItem.end);
      this.items.splice(me, 1);
    }
  }
};
</script>

<style scoped lang="less">

</style>
