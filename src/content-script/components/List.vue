<template>
	<div>
		<button @click="goToVideo(k)" v-for="(i, k) in list">
			{{ i }}
		</button>
	</div>
</template>

<script>
  
  import { mapGetters, mapState } from 'vuex';
  import { sendMessage } from '../message';
  import { MessageType } from '../../utils/types';
  
  export default {
    components: {},
    data() {
      return {};
    },
    computed: {
      ...mapState(['speed', 'config', 'list']),
      ...mapGetters(['vid']),
      
    },
    watch: {},
    mounted() {
    },
    methods: {
      goToVideo(vid) {
        sendMessage({
          type: MessageType.openTab,
          value: 'https://www.bilibili.com/video/' + vid,
        });
      },
    },
  };
</script>

<style scoped lang="less">

</style>
