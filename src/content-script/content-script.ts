import './content-script.css';
import Vue from 'vue';
import App from './App.vue';

global.browser = require('webextension-polyfill');

document.addEventListener('DOMContentLoaded', () => {
  // https://stackoverflow.com/questions/59816151/in-chrome-extension-how-to-use-content-script-to-inject-a-vue-page
  const el = document.createElement('div');
  el.id = 'app';
  document.body.insertBefore(el, document.body.firstChild);
  new Vue({
    el: el,
    render: h => {
      return h(App);
    },
  });
})

// if (isBilibili()) {
//
//   const vid = getVid();
//   console.log('vid===', vid);
//   document.addEventListener('DOMContentLoaded', function() {
//     injectCustomJs();
//
//     initCustomPanel();
//   });
//
//
//   window.addEventListener('message', function(e) {
//     console.log('vitaaaa收到消息：', e.data);
//     if (e.data && e.data.cmd == 'invoke') {
//       eval('(' + e.data.code + ')');
//     } else if (e.data && e.data.cmd == 'message') {
//       tip(e.data.data);
//     }
//   }, false);
//
//
//   // 接收来自后台的消息
//   chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     console.log('vitatatatata收到来自 ' + (sender.tab ? 'content-script(' + sender.tab.url + ')' : 'popup或者background') + ' 的消息：', request);
//     if (request.cmd == 'update_font_size') {
//       var ele = document.createElement('style');
//       ele.innerHTML = `* {font-size: ${request.size}px !important;}`;
//       document.head.appendChild(ele);
//     } else {
//       tip(JSON.stringify(request));
//       sendResponse('我收到你的消息了：' + JSON.stringify(request));
//     }
//   });
//
//
// }
//
// function initCustomPanel() {
//   var panel = document.createElement('div');
//   panel.className = 'chrome-plugin-demo-panel';
//   panel.innerHTML = `
// 		<h2>injected-script操作content-script演示区：</h2>
// 		<div class="btn-area">
// 			<a href="javascript:test('你好，我是普通页面！')">test-script</a><br>
// 			<a href="javascript:sendMessageToContentScriptByPostMessage('你好，我是普通页面！')">通过postMessage发送消息给content-script</a><br>
// 			<a href="javascript:sendMessageToContentScriptByEvent('你好啊！我是通过DOM事件发送的消息！')">通过DOM事件发送消息给content-script</a><br>
// 			<a href="javascript:invokeContentScript('sendMessageToBackground()')">发送消息到后台或者popup</a><br>
// 		</div>
// 		<div id="my_custom_log">
// 		</div>
// 	`;
//   document.body.appendChild(panel);
// }
//
//
// // 向页面注入JS
// function injectCustomJs(jsPath?: string) {
//   jsPath = jsPath || 'inject.js';
//   var temp = document.createElement('script');
//   temp.setAttribute('type', 'text/javascript');
//   // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
//   temp.src = chrome.extension.getURL(jsPath);
//   temp.onload = (el: Event) => {
//     // 放在页面不好看，执行完后移除掉
//     temp.parentNode.removeChild(temp);
//   };
//   document.body.appendChild(temp);
// }
//
// let tipCount = 0;
//
// // 简单的消息通知
// export function tip(info) {
//   info = info || '';
//   var ele = document.createElement('div');
//   ele.className = 'chrome-plugin-simple-tip slideInLeft';
//   ele.style.top = tipCount * 70 + 20 + 'px';
//   ele.innerHTML = `<div>${info}</div>`;
//   document.body.appendChild(ele);
//   ele.classList.add('animated');
//   tipCount++;
//   setTimeout(() => {
//     ele.style.bottom = '100px';
//     setTimeout(() => {
//       ele.remove();
//       tipCount--;
//     }, 400);
//   }, 3000);
// }
