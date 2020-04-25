<template>
  <div>
    <div v-if="video" class="flex col center">
      <div class="w100" v-if="items&&items.length>0">
        <control-item
                :key="i"
                v-for="(v, i) in items"
                :video="video"
                :ratio="ratio"
                :defaultValues="v"
                :duration="duration"
                @start="val => (v.start = val)"
                @end="val => (v.end = val)"
                @togglePlay="togglePlayItem(i, ...arguments)"
                @del="delItem(i)"
                @add="addItem(i)"
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
        <el-button
                plain
                icon="el-icon-document"
                round
                type="primary"
                @click="save"
        ></el-button>
        <el-button
                plain
                round
                type="primary"
                @click="add"
                icon="el-icon-plus"
        ></el-button>
        <el-button
                plain
                round
                type="primary"
                @click="clear"
                icon="el-icon-delete"
        ></el-button>
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
  
  export default {
  components: { Keymap, ControlItem },
  data() {
    return {
      playing: false,
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
    ...mapGetters(["vid"]),
    defaultItems() {
      return [
        {
          start: this.video.currentTime,
          end: this.duration,
          playing: false,
          canvasStr: false
        }
      ];
    }
  },
  watch: {
    speed: function(now) {
      this.setSpeed(now);
    },
    vid: function(now, old) {
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
      this.togglePlayItem(this.items.length - 1, newItem.start, newItem.end);
    },
    addItem(index) {
      const duration = this.video.duration;
      const currentTime = this.video.currentTime;

      if (currentTime >= duration) {
        return;
      }
      // set end for current item

      if (currentTime > this.items[index].start) {
        console.log("currentTime===", currentTime);
        this.items[index].end = currentTime;
      }
      // add a new item which start with  current time
      const { bufferTime } = this.config;
      const newItem = {
        playing: false,
        start: Math.max(0, currentTime),
        end: duration,
        canvasStr: ""
      };
      this.items.push(newItem);
      this.togglePlayItem(this.items.length - 1, newItem.start, newItem.end);
    },
    togglePlayItem(index, start, end, playing = true) {
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
    save() {
      console.log("thisVid===", this.vid);
      saveItems(this.vid, this.items);
    },
    clear() {
      this.items = false;
      clearItems(this.vid);
    }
  }
};
</script>

<style scoped lang="less">

</style>
