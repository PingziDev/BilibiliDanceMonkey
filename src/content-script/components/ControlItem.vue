<template>
	<div class="item">
		<canvas ref="canvas"></canvas>
		
		{{defaultValues.playing?'播放中':'暂停'}}
		<button @click="setStart">{{start||'开始'|time}}</button>
		<button @click="setEnd">{{end||'结束'|time}}</button>
		<button @click="play">播放</button>
		<button @click="snap">截图</button>
		<button @click="$emit('add',start,end)">添加</button>
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
      ratio: { type: Number },
      defaultValues: {
        type: Object,
        default() {
          return {
            playing: false,
          };
        },
      },
    },
    data() {
      return {
        start: (this.defaultValues || {}).start || 20,
        end: (this.defaultValues || {}).end || 25,
        canvas: undefined,
        context: undefined,
      };
    },
    watch: {
      ratio: function(now) {
        this.canvas.height = parseInt(this.canvas.width / this.ratio, 10);
      },
    },
    mounted() {
      this.canvas = this.$refs.canvas;
      this.context = this.canvas.getContext('2d');
      this.canvas.width = this.$store.state.config.captureW;
      this.canvas.height = parseInt(this.canvas.width / this.ratio, 10);
      this.context.src = (this.defaultValues || {}).canvasStr;
    },
    methods: {
      setStart() {
        this.start = this.video.currentTime || 0;
        this.snap();
      },
      setEnd() {
        this.end = this.video.currentTime || 0;
        this.play()
      },
      play() {
        this.$emit('play', this.start, this.end);
      },
      snap() {
        let { context, video, canvas } = this;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
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
