export function hasVideo() {
  return location.host.includes('bilibili.com') && location.pathname.startsWith('/video/');
}


export function getVideoDom(): HTMLVideoElement | false {
  const dom = document.querySelector('.bilibili-player-video');
  if (!dom) {
    // alert('没有视频在播放!');

    return false;
  }
  return dom.childNodes.item(0) as HTMLVideoElement;
}
