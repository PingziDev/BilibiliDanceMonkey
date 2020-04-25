import './content-script.css';
import Vue from 'vue';
import App from './App.vue';
import { sendMessage } from './message';
import store from './../store';
import { getStorage, setStorage } from '../utils/storage';
import { Commands, MessageObj, MessageType } from '../utils/types';
import { FASTER, SET_CONFIG, SET_LIST, SET_SPEED, SET_URL, SLOWER } from '../store/mutation-types';
import Error from './components/Error';

global.browser = require('webextension-polyfill');

document.addEventListener('DOMContentLoaded', () => {
  // https://stackoverflow.com/questions/59816151/in-chrome-extension-how-to-use-content-script-to-inject-a-vue-page

  const el = document.createElement('div');
  el.id = 'app';
  document.body.insertBefore(el, document.body.firstChild);
  Vue.prototype.$sendMessage = sendMessage;
  Vue.prototype.$url = (val) => {
    return chrome.extension.getURL(val);
  };
  Vue.filter('time', (time: number | string) => {
    return typeof time === 'number' ? time.toFixed(2) : time;
  });
  Vue.filter('speed', (speed: number) => {
    return speed.toFixed(1);
  });

Vue.component(Error.name,Error)

  new Vue({
    el: el,
    render: h => {
      return h(App);
    },
    store,
    mounted() {
      // 默认设置
      getStorage('config').then(res => {
        if (res) {
          return this.$store.commit(SET_CONFIG, res);
        }
        const config = {
          bufferTime: 4,
          captureW: 100,
        };
        setStorage('config', config);
        return this.$store.commit(SET_CONFIG, config);
      });

      // 以前的数据
      getStorage('list').then(res => {
        this.$store.commit(SET_LIST, res);
      });


      // 处理bg传来的命令
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

        if (typeof request === 'string') {
          switch (request) {
            case Commands.faster:
              store.commit(FASTER);
              break;
            case Commands.slower:
              store.commit(SLOWER);
              break;
            case Commands.speed5:
              store.commit(SET_SPEED, 0.5);
              break;
            case Commands.speed1:
              store.commit(SET_SPEED, 1);
              break;
            default:
          }
        } else {
          switch ((<MessageObj>request).type) {
            case MessageType.urlChange:
              store.commit(SET_URL,request.value)
              break;
          }
        }
      });
    },
  });
});
