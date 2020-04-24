// 桌面通知
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

