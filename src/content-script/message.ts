//content-script主动发消息给background
import { MessageObj } from '../utils/types';

export function sendMessage(message: string | MessageObj) {
  chrome.runtime.sendMessage(message, function(response) {
    // console.log('收到来自后台的回复：' + response);
  });
}

