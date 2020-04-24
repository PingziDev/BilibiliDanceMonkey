export const foo = state => state.foo;
export const vid = state => {
  console.log('stateUrl===', state.url);
  if (!state.url.includes('bilibili.com/video/')) {
    return false;
  }
  const temp = state.url.slice(state.url.indexOf('/video/'));
  return temp.split('/')[2];
};
