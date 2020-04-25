import * as types from './mutation-types';
import { setStorage } from '../utils/storage';

export default {
  [types.UPDATE_FOO](state, payload) {
    state.foo = payload;
  },
  [types.SET_SPEED](state, payload) {
    state.speed = payload;
  },
  [types.FASTER](state) {
    state.speed += 0.1;
  },
  [types.SLOWER](state) {
    state.speed -= 0.1;
    if (state.speed <= 0) {
      state.speed = 0.1;
    }
  },
  [types.SET_CONFIG](state, payload) {
    state.config = payload;
  },
  [types.SET_URL](state, payload) {
    state.url = payload;
  },
  [types.SET_LIST](state, payload) {
    state.list = payload;
    setStorage('list', state.items);
  },
  [types.ADD_VID](state, payload) {
    state.list[payload.vid] = payload.title;
    setStorage('list', state.list);
  },
  [types.REMOVE_VID](state, vid) {
    delete state.list[vid];
    setStorage('list', state.list);
  },
  [types.SET_SHOW_TYPE](state, type) {
    state.showType = type;
  },  [types.SET_PLAYING](state, type) {
    state.playing = type;
  },
};
