export function isBilibili() {
  return location.host.includes('bilibili.com') && location.pathname.startsWith('/video/');
}

export function getVid() {
  return location.pathname.split('/')[2];
}
