/**
 * 本地存储
 本地存储建议用chrome.storage而不是普通的localStorage，区别有好几点，个人认为最重要的2点区别是：

 chrome.storage是针对插件全局的，即使你在background中保存的数据，在content-script也能获取到；
 chrome.storage.sync可以跟随当前登录用户自动同步，这台电脑修改的设置会自动同步到其它电脑，很方便，如果没有登录或者未联网则先保存到本地，等登录了再同步至网络；
 */
export type ValueType = string | number | object | boolean

export async function setStorage(key: string, value: ValueType): Promise<void> {
  if (!chrome.storage) {
    throw new Error('不支持chrome.storage');
  }
  if (typeof value === 'object') {
    value = JSON.stringify(value);
  }
  return new Promise(resolve => {
    chrome.storage.sync.set({ [key]: value }, () => {
      resolve();
    });
  });
}

export async function getStorage(key): Promise<ValueType> {
  return new Promise(resolve => {
    chrome.storage.sync.get(key, (items) => {
      let res = items[key];
      if (typeof res === 'string') {
        res = JSON.parse(res);
      }
      resolve(res);
    });
  });
}
