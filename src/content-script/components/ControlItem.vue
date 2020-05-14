<template>
  <div style="position: relative">
    <div class="topbtns" :class="{ playing: active }">
      <el-tooltip content="删除这个片段" effect="light">
        <span class="del " @click="$emit('del')"
          ><span class="icon"><i class="el-icon-close"></i></span
        ></span>
      </el-tooltip>
      <el-tooltip content="从头播放这个片段" effect="light">
        <span class="refresh " @click="$emit('playfromme', start, end)"
          ><span class="icon"><i class="el-icon-refresh"></i></span
        ></span>
      </el-tooltip>
      <el-tooltip content="从这个片段末尾新建" effect="light">
        <span class="addfromme " @click="$emit('add')"
          ><span class="icon"><i class="el-icon-location"></i></span
        ></span>
      </el-tooltip>
      <el-tooltip content="向上合并这个片段" effect="light">
        <span class="merge " @click="$emit('merge', start, end)"
          ><span class="icon"><i class="el-icon-upload2"></i></span
        ></span>
      </el-tooltip>
    </div>
    <div class="item" :class="{ active: active }">
      <div class="w100 flex sb st ontop">
        <div
          style="cursor: pointer"
          @click="togglePlay(!defaultValues.playing)"
        >
          <i
            class="play__btn el-icon-caret-right"
            :class="{ playing: defaultValues.playing }"
          ></i>
          <canvas
            style="border-radius: 10px"
            class="canvas"
            ref="canvas"
          ></canvas>
        </div>

        <div class="flex col sb btm">
          <div class="times__btn">
            <el-tooltip content="点击设置为当前时间" effect="light">
              <span @click="setStart()">{{ start | time }}</span>
            </el-tooltip>
            -
            <el-tooltip content="点击设置为当前时间" effect="light">
              <span @click="setEnd()">{{ end | time }}</span>
            </el-tooltip>
          </div>
          <el-button-group>
            <!--					<el-button type="primary" :plain="!defaultValues.playing"  size="mini" @click="play" icon="el-icon-caret-right"></el-button>-->
            <!--			<button @click="playFrom">从这开始</button>-->
          </el-button-group>
        </div>
      </div>
      <div class="ontop" style="margin-bottom: -10px;">
        <el-slider
                v-model="slides"
                range
                :step="1"
                :max="duration"
                @change="onSlide"
                :format-tooltip="val=>(val||0).toFixed(0)"
        >
        </el-slider>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    video: {
      type: HTMLVideoElement,
      required: true
    },
    ratio: { type: [Number, Boolean] },
    active: { type: [Boolean] },
    defaultValues: {
      type: Object,
      required: true
    },
    duration: { type: Number }
  },
  data() {
    return {
      start: this.defaultValues.start,
      end: this.defaultValues.end,
      canvas: undefined,
      context: undefined,
      slides: []
    };
  },
  watch: {
    "defaultValues.start"(now) {
      this.start = now;
      this.slides = [this.start, this.end];
    },
    "defaultValues.end"(now) {
      this.end = now;
      this.slides = [this.start, this.end];
    }
  },
  mounted() {
    this.slides = [this.start, this.end];
    this.canvas = this.$refs.canvas;
    this.context = this.canvas.getContext("2d");
    this.canvas.width = 100;
    this.canvas.height = parseInt(this.canvas.width / this.ratio, 10);
    console.log('thisCanvas===', this.canvas);
    if (this.defaultValues.canvasStr) {
      let img = new Image();
      img.onload = () => {
        this.context.drawImage(img, 0, 0);
      };
      img.src = this.defaultValues.canvasStr;
    } else {
      this.snap();
    }
  },
  methods: {
    setStart(start) {
      const now = start === 0 ? start : (start || this.video.currentTime || 0);
      if (this.start !== now) {
        this.start = now;
        this.$emit('setStart', this.start, this.end);
        this.snap();
      }
    },
    setEnd(end) {
      const now = end || this.video.currentTime || 0;
      if (this.end !== now) {
        this.end = now;
        this.$emit('setEnd', this.start, this.end);
      }
    },
    togglePlay(playing) {
      this.$emit("togglePlay", this.start, this.end, playing);
    },
    playFrom() {
      this.$emit("play", this.start);
    },
    snap() {
      let { context, video, canvas } = this;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.$emit("snap", canvas.toDataURL());
    },
    onSlide() {
      this.setStart(arguments[0][0]);
      this.setEnd(arguments[0][1]);
    }
  }
};
</script>

<style scoped lang="less">
.item {
  position: relative;
  padding: 20px;
  border-radius: 10px;
  margin-top: 15px;
  background: #f5f5f5;
  overflow: hidden;
  border: 2px solid #f8c8cd;

  &.active {
    border: 2px solid #f27991;

    &:before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      filter: blur(20px);
      background-image: url("chrome-extension://__MSG_@@extension_id__/assets/monkey.png");
      background-size: cover;
      z-index: 1000;
    }
  }
}

.topbtns {
  > span {
    color: #f27991;
    position: absolute;
    background-color: #fff;
    width: 20px;
    height: 20px;
    top: -10px;
    z-index: 1002;
    border-radius: 50%;
    border: 2px solid #f8c8cd;

    .icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    &:hover {
      color: #fff;
      background-color: #f8a6ac;
    }
  }

  &.playing {
    > span {
      border: 2px solid #f27991;
    }
  }
}

.del {
  right: -10px;
}

.refresh {
  right: 30px;
}
.addfromme {
  right: -10px;
  top: 30px !important;
}

.merge {
  right: 70px;
}

.ontop {
  position: relative;
  z-index: 1002;
}
.times__btn {
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  text-shadow: #f24e78 1px 2px 3px;
}

.canvas {
  cursor: pointer;
}

.play__btn {
  font-size: 40px;
  color: #fff;
  position: absolute;
  top: 8px;
  opacity: 0.7;

  &.playing {
    opacity: 0;
  }
}
</style>
