<template>
  <div>
    <button @click="show">link</button>
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    },
    methods: {
      show() {
        const video=document.querySelector('.bilibili-player-video')
        console.error('video===',video)
      },
    },
  };
</script>

<style lang="scss" scoped>
  p {
    font-size: 20px;
  }
</style>
