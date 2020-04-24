import './content-script.css';
import Vue from 'vue';
import App from './App.vue';
import { isBilibili } from '../utils/bilibili';
import { sendMessage } from './message';
import store from './../store';

global.browser = require('webextension-polyfill');


if (isBilibili()) {
  document.addEventListener('DOMContentLoaded', () => {
    // https://stackoverflow.com/questions/59816151/in-chrome-extension-how-to-use-content-script-to-inject-a-vue-page

    const el = document.createElement('div');
    el.id = 'app';
    document.body.insertBefore(el, document.body.firstChild);
    Vue.prototype.$sendMessage = sendMessage;
    Vue.filter('time', (time: number | string) => {
      return typeof time === 'number' ? time.toFixed(2) : time;
    });
    Vue.filter('speed', (speed: number) => {
      return speed.toFixed(1);
    });



    new Vue({
      el: el,
      render: h => {
        return h(App);
      },
      store,
    });
  });


}
