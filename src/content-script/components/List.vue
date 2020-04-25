<template>
	<div>
		<error>保存的扒舞都在这里~点击就可以打开 👏</error>
		<div v-if="list&&Object.keys(list).length>0">
			<el-card class="listitem" v-for="(i, k) in list">
				<a @click="goToVideo(k)">{{ i }}</a>
			</el-card>
		</div>
		<div v-else>
			<error>
				暂时还没有扒舞记录哦~ 点击
				<el-button type="primary" size="mini" plain round @click="$store.commit('SET_SHOW_TYPE','video');"
				>扒舞
				</el-button
				>
				马上开始吧! 别忘了扒舞后要保存才会出现在这里哟~
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
