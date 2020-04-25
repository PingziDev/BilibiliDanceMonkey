<template>
	<div class="fixed ">
		<div v-if="config" class="wrapper " :class="{ active: show }">
			<!--money btn-->
			<div class="leftbtns">
				<div
						class="monkey"
						:class="{ active: show }"
						@click="show = !show"
				></div>
				<div>
					<el-button type="primary" round>播放</el-button>
				</div>
				<div v-for="i in ['0.3','0.5','0.7','0.9','1.0']">
					<el-button @click="$store.commit('SET_SPEED', i)" size="middle" :plain="$store.state.speed!=i" round type="primary">x {{i}}</el-button>
				</div>
			
			
			</div>
			
			<!--			<el-tooltip :content="show?'点我关闭哟~':'点我扒舞吧~'" placement="top" effect="light">-->
			<!--			</el-tooltip>-->
			<el-card
					class="box-card panel"
					:body-style="{
          padding: '0 15px 100px 30px',
          height: `calc(100% - 100px)`,
          overflowY: 'scroll'
        }"
			>
				<div v-if="video">
					<control></control>
				</div>
				<div v-else>
					这个页面暂不支持扒舞猴子哦~
				</div>
			</el-card>
		</div>
		<div v-else>
			配置加载失败...
		</div>
	</div>
</template>

<script>
  import { getVideoDom } from '../utils/bilibili';
  import Control from './components/Control';
  import { mapGetters, mapState } from 'vuex';
  import ElementUI from 'element-ui';
  import Vue from 'vue';
  // import 'element-ui/lib/theme-chalk/index.css';
  import '../element/index.css';
  import './main.less';
  
  Vue.use(ElementUI);

  export default {
    name: 'App',
    components: { Control },
    data() {
      return {
        show: true,
        video: undefined,
      };
    },
    computed: {
      ...mapState(['config', 'list']),
      ...mapGetters(['vid']),
    },
    mounted() {
      this.video = getVideoDom();
    },
    methods: {},
  };
</script>

<style scoped lang="less">
	.fixed {
		position: fixed;
		right: 0;
		top: 0;
		z-index: 1001;
		height: 100vh;
	}
	
	.wrapper {
		transition: all 0.5s linear;
		position: absolute;
		right: -320px;
		top: 0;
		width: 320px;
		height: 100%;
		
		&.active {
			transition: all 0.5s linear;
			transform: translate(-320px, 0);
		}
	}
	
	.leftbtns {
		position: absolute;
		left: -40px;
		z-index: 1002;
		padding-top: 30px;
		
		> div {
			margin-top: 15px;
		}
	}
	
	.monkey {
		padding: 30px;
		background-image: url("chrome-extension://__MSG_@@extension_id__/assets/monkey.png");
		background-size: 60px 100%;
		background-repeat: no-repeat;
		
		&:hover {
			background-image: url("chrome-extension://__MSG_@@extension_id__/assets/monkey-wu.png");
		}
	}
	
	.panel {
		position: relative;
		width: 320px;
		height: 100vh;
		
	}
	
	.el-button {
		margin-left: -15px;
	}
</style>

<style>
	/*[class*=" el-icon-"], [class^="el-icon-"] {*/
	/*	font-size: 30px;*/
	/*}*/
</style>
