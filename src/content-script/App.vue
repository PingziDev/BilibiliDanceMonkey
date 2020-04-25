<template>
	<div class="fixed" >
		<div v-if="config" class="wrapper flex center" :class="{active:show}" >
			<el-tooltip :content="show?'点我关闭哟~':'点我扒舞吧~'" placement="top" effect="light">
				<div class="monkey" :class="{active:show}" @click="show=!show"></div>
			</el-tooltip>
			<el-card class="box-card panel" :body-style="{paddingLeft:'15px',paddingRight:'15px',background:'#f5f5f5',height:'100%'}" >
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
  ...mapGetters(['vid'])
    },
    mounted() {
      this.video = getVideoDom();
    },
    methods: {

    },
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
		transition: all .5s linear;
		position: absolute;
		right: -320px;
		top: 0;
		width: 320px;
		height: 100%;
		
		&.active {
			transition: all .5s linear;
			transform: translate(-320px, 0);
		}
	}
	
	.monkey {
		position: absolute;
		padding: 30px;
		left: -40px;
		background-image: url('chrome-extension://__MSG_@@extension_id__/assets/monkey.png');
		background-size: 60px 100%;
		background-repeat: no-repeat;
		transition: left 1s;
		z-index: 1002;
		
		&:hover {
			background-image: url('chrome-extension://__MSG_@@extension_id__/assets/monkey-wu.png');
			
		}
	}
	
	.panel {
		width: 100%;
		height: 100vh;
		overflow-y: scroll;

	}
	

</style>

<style>
	/*[class*=" el-icon-"], [class^="el-icon-"] {*/
	/*	font-size: 30px;*/
	/*}*/
</style>
