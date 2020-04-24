<template>
	<div>
		<button @click="setStart">{{start||'开始'|time}}</button>
		<button @click="setEnd">{{end||'结束'|time}}</button>
		<button @click="$emit('play',start,end)">播放</button>
	</div>
</template>

<script>
  
  
  export default {
    props: {
      video: {
        type: HTMLVideoElement,
        required: true,
      },
    },
    data() {
      return {
        start: 5,
        end: 8,
      };
    },
    methods: {
      setStart() {
        this.start = this.video.currentTime || 0;
      },
      setEnd() {
        this.end = this.video.currentTime || 0;
      },
    },
  };
</script>

<style scoped lang="less">

</style>
