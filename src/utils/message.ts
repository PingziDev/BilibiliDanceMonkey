// 桌面通知
import { MessageObj } from './types';

export function notification() {
  if (!chrome.notifications) {
    throw new Error('不支持chrome.notifications');
  }
  chrome.notifications.create(null, {
    type: 'basic',
    iconUrl: 'img/icon.png',
    title: '这是标题',
    message: '您刚才点击了自定义右键菜单！',
  });
}

//popup或者bg向content主动发送消息
export function sendMessageToContentScript(message: string | MessageObj, callback?: Function) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    console.log('message===', message);
    if (tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
        if (callback) callback(response);
      });
    }
    });

}
