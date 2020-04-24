<template>
  <div>
    <p>{{speed}}</p>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  
  export default {
  name: 'App',
    computed: {
      ...mapState(['speed']),
    },
};
</script>

<style scoped>
p {
  font-size: 20px;
}
</style>
