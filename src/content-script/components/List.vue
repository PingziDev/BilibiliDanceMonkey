<template>
	<div>
		<div v-if="list&&Object.keys(list).length>0">
			<el-card class="listitem" @click="goToVideo(k)" v-for="(i, k) in list">
				<a>{{ i }}</a>
			</el-card>
		</div>
		<div v-else>
			<error>
				暂时还没有扒舞记录哦~
			</error>
		</div>
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
	.listitem {
		margin-top: 20px;
		cursor: pointer;
	}
</style>
