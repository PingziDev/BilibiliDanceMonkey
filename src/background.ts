import { sendMessageToContentScript } from './utils/message';
import { MessageType } from './utils/types';

global.browser = require('webextension-polyfill');


chrome.runtime.onInstalled.addListener(function() {

  // 监听来自content-script的消息
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request, sender, sendResponse);
    sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
  });


// 监听keyboard commands
  chrome.commands.onCommand.addListener(function(command) {
    console.log('Command:', command);
    sendMessageToContentScript(command);
  });

// 监听路由变化
  chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
      // read changeInfo data and do something with it
      // like send the new url to contentscripts.js
      if (changeInfo.url) {
        sendMessageToContentScript({ type: MessageType.urlChange, value: changeInfo.url });
      }
    },
  );

})
