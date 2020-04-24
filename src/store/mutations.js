import * as types from './mutation-types';

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
};
