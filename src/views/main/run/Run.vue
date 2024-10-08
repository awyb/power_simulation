<style scoped lang="less">
  .container {  height: 100%;
    .chart-container { height: 600px;width: 1000px;box-shadow: 0px 0px 5px 0px #adadad;margin: 50px auto;}
  }
</style>

<template>
  <el-container class="container">
    <el-aside :width="runAsideW">
      <run-aside></run-aside>
    </el-aside>
    <el-main>
      <dyn-line style="height: 600px;width: 1000px;margin: 50px auto;"></dyn-line>
      <dyn-line style="height: 600px;width: 1000px;margin: 50px auto;"></dyn-line>
    </el-main>
  </el-container>
    
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { computed } from 'vue'
import DynLine from './DynLine.vue'
// import Plotly from 'plotly.js-dist'
import RunAside from './RunAside.vue'
const store = useStore()
const runAsideW = computed(() => store.state.runAsideW + 'px')
const func1 = {

}
const func2 = {
  
}
</script>