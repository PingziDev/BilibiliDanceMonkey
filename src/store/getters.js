export const foo = state => state.foo;
export const vid = state => {
  console.log("stateUrl===", state.url);
  if (!state.url.includes("bilibili.com/video/")) {
    return false;
  }
  let temp = state.url.slice(state.url.indexOf("/video/"));
  temp = temp.split("/")[2];
  if (temp.includes("?")) {
    return temp.split("?")[0];
  }
  return temp;
};

export const showSpeedBtns = state => (state.config || {}).showSpeedBtns;
