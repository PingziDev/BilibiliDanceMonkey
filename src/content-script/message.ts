//content-script主动发消息给background
export function sendMessage(message: any) {
  chrome.runtime.sendMessage(message, function(response) {
    // console.log('收到来自后台的回复：' + response);
  });
}
