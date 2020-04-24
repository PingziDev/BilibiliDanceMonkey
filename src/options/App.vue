<template>
  <div v-if="config">
    {{config}}
    <p>默认上下片段缓冲时间(s) <input type="number" v-model="config.bufferTime"> <span>下一片段开始</span></p>
    <button @click="save">保存</button>
  </div>
</template>

<script>
  import { getStorage, setStorage } from '../utils/storage';
  
  export default {
  name: 'App',
    data() {
      return {
        config: false,
      };
    },
    created() {
      getStorage('config').then(res => {
        this.config = res;
      });
    
    },
    methods: {
      save() {
        setStorage('config', this.config);
      },
    },
};
</script>

<style scoped>
p {
  font-size: 20px;
}
</style>
