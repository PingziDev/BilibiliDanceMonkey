<template>
	<div class="item">
		{{defaultValues.playing?'播放中':'暂停'}}
		<button @click="setStart">{{start||'开始'|time}}</button>
		<button @click="setEnd">{{end||'结束'|time}}</button>
		<button @click="play">播放</button>
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
      };
    },
    methods: {
      setStart() {
        this.start = this.video.currentTime || 0;
      },
      setEnd() {
        this.end = this.video.currentTime || 0;
        this.play()
      },
      play() {
        this.$emit('play', this.start, this.end);
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
