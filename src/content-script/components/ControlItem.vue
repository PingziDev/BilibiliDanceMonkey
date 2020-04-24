<template>
	<div class="item">
		<canvas ref="canvas"></canvas>
		
		{{defaultValues.playing?'播放中':'暂停'}}
		<button @click="setStart">{{start|time}}</button>
		<button @click="setEnd">{{end|time}}</button>
		<button @click="play">播放</button>
		<button @click="playFrom">从这开始</button>
		<button @click="$emit('add')">添加</button>
		<button @click="$emit('del')">删除</button>
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
    },
    data() {
      return {
        start: this.defaultValues.start,
        end: this.defaultValues.end,
        canvas: undefined,
        context: undefined,
      };
    },
    watch: {
      'defaultValues.end'(now) {
        this.end = now;
      },
    },
    mounted() {
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
      setStart() {
        this.start = this.video.currentTime || 0;
        this.$emit('start', this.start);
        this.snap();
      },
      setEnd() {
        this.end = this.video.currentTime || 0;
        this.$emit('end', this.end);
        this.play()
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
        console.log('canvasWidth===',canvas.width)
        this.$emit('snap', canvas.toDataURL());
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
