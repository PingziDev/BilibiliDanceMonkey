import { sendMessageToContentScript } from './utils/message';

global.browser = require('webextension-polyfill');

/**
 * content_scripts向popup主动发消息的前提是popup必须打开！否则需要利用background作中转；
 如果background和popup同时监听，那么它们都可以同时收到消息，但是只有一个可以sendResponse，一个先发送了，那么另外一个再发送就无效；
 */
function addMessageListener() {
  // 监听来自content-script的消息
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request, sender, sendResponse);
    sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
  });

}

addMessageListener();

// 监听keyboard commands
chrome.commands.onCommand.addListener(function(command) {
  console.log('Command:', command);
  sendMessageToContentScript(command);
});


