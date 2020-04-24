export function isBilibili() {
  return location.host.includes('bilibili.com') && location.pathname.startsWith('/video/');
}

export function getVid() {
  return location.pathname.split('/')[2];
}

export function getVideoDom(): HTMLVideoElement {
  const dom = document.querySelector('.bilibili-player-video');
  if (!dom) {
    alert('没有视频在播放!');
  }
  return dom.childNodes.item(0) as HTMLVideoElement;
}
