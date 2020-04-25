<template>
<div style="position: relative">
	<span class="del " @click="$emit('del')"><span class="icon"><i class="el-icon-close"></i></span></span>
	<div class="item" :class="{active:defaultValues.playing}">
		<div class="w100 flex sb st ontop">
			<div style="cursor: pointer" @click="togglePlay(!defaultValues.playing)">
				<i class="play__btn el-icon-caret-right" :class="{playing:defaultValues.playing}"></i>
				<canvas  style="border-radius: 10px" class="canvas" ref="canvas"></canvas>
			</div>
			
			<div class="flex col sb btm">
				<div class="times__btn">
					<span  @click="setStart()">{{start|time}}</span>
					-
					<span  @click="setEnd()">{{end|time}}</span>
				</div>
				<el-button-group>
					<!--					<el-button type="primary" :plain="!defaultValues.playing"  size="mini" @click="play" icon="el-icon-caret-right"></el-button>-->
					<el-button type="primary" plain size="mini" @click="$emit('add')" icon="el-icon-plus"></el-button>
					<!--			<button @click="playFrom">从这开始</button>-->
				</el-button-group>
			</div>
		</div>
		<div class="ontop" style="margin-bottom: -10px;">
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
      'defaultValues.start'(now) {
        this.start = now;
        this.slides = [this.start, this.end];
      },
      'defaultValues.end'(now) {
        this.end = now;
        this.slides = [this.start, this.end];
  
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
          this.togglePlay(true);
          this.snap();
        }
  
      },
      setEnd(end) {
        const now = end || this.video.currentTime || 0;
        if (this.end !== now) {
          this.end = now;
          this.$emit('end', this.end);
          this.togglePlay(true);
        }
      
      },
      togglePlay(playing){
        console.log('playing===',playing)
        this.$emit('togglePlay', this.start, this.end,playing);
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
		border: thick double #f8c8cd;
		position: relative;
		padding: 20px;
		border-radius: 10px;
		margin-top:  15px;
		background: #fff;
		overflow: hidden;
		
		&.active {
			&:before {
				content: '';
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				filter: blur(20px);
				background-image: url('chrome-extension://__MSG_@@extension_id__/assets/monkey.png');
				background-size: cover;
				z-index: 1000;
			}
		}
	}
	
	.del {
		color: #f2bbd1;
		position: absolute;
		background-color: #fff;
		width: 20px;
		height: 20px;
		top: -10px;
		right: -10px;
		z-index: 1002;
		border-radius: 50%;
		border: thick double #f8c8cd;
		
		.icon{
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
	.ontop{
		position: relative;
		z-index: 1002;
	}
	.times__btn{
		color: #fff;
		cursor: pointer;
		font-size: 16px;
		font-weight: bold;
		text-shadow: #f88f97 1px 2px 3px;
	}
	
	.canvas {
		cursor: pointer;
	}
	
	.play__btn {
		font-size: 40px;
		color: #fff;
		position: absolute;
		top: 8px;
		opacity: .7;
		
		&.playing {
			opacity: 0;
		}
	}
</style>
