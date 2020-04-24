<template>
	<div class="item">
		<canvas ref="canvas"></canvas>
		
		{{defaultValues.playing?'播放中':'暂停'}} {{duration}}
		<button @click="setStart">{{start|time}}</button>
		<button @click="setEnd">{{end|time}}</button>
		<button @click="play">播放</button>
		<button @click="playFrom">从这开始</button>
		<button @click="$emit('add')">添加</button>
		<button @click="$emit('del')">删除</button>
		<div>
			<el-slider
					v-model="slides"
					range
					:step="0.1"
					:max="duration"
					@change="onSlide"
			>
			</el-slider>
		</div>
	</div>
</template>

<script>
  
  
  export default {
    props: {
      video: {
        type: HTMLVideoElement,
        required: true,
      },
      ratio: { type: [Number, Boolean] },
      defaultValues: {
        type: Object,
        required: true,
      },
      duration: { type: Number },
    },
    data() {
      return {
        start: this.defaultValues.start,
        end: this.defaultValues.end,
        canvas: undefined,
        context: undefined,
        slides: [],
      };
    },
    watch: {
      'defaultValues.end'(now) {
        this.end = now;
      },
    },
    mounted() {
      this.slides = [this.start, this.end];
      this.canvas = this.$refs.canvas;
      this.context = this.canvas.getContext('2d');
      this.canvas.width = this.$store.state.config.captureW;
      this.canvas.height = parseInt(this.canvas.width / this.ratio, 10);
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
        const now = start || this.video.currentTime || 0;
        if (this.start !== now) {
          this.start = now;
          this.$emit('start', this.start);
          this.play();
          this.snap();
        }
  
      },
      setEnd(end) {
        const now = end || this.video.currentTime || 0;
        if (this.end !== now) {
          this.end = now;
          this.$emit('end', this.end);
          this.play();
        }
      
      },
      play() {
        this.$emit('play', this.start, this.end);
      },
      playFrom(){
        this.$emit('play', this.start);
      },
      snap() {
        let { context, video, canvas } = this;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        this.$emit('snap', canvas.toDataURL());
      },
      onSlide() {
        this.setStart(arguments[0][0]);
        this.setEnd(arguments[0][1]);
      },
    },
  };
</script>

<style scoped lang="less">
	.item {
		padding: 30px;
		border: 1px solid #aaa;
		background-color: #fff;
	}
</style>
