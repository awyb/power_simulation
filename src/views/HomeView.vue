<style scoped lang="less">
  .home { position: relative;width: 100%;height: 100%;
    .container {  height: 100%;}
  }
</style>

<template>
  <div class="home">
    <el-container class="container">
      <el-header height="5%">
        <Header></Header>
      </el-header>
      <el-main height="90%">
        <!-- <Main></Main> -->
        <Demo1></Demo1>
      </el-main>
      <el-footer height="5%">
        <Footer></Footer>
      </el-footer>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Header from '@/views/header/Header.vue'
import Main from '@/views/main/Main.vue'
import Demo1 from '@/views/main/Demo1.vue'

import Footer from '@/views/footer/Footer.vue'
@Options({
  components:
  {
    Header,
    // Main,
    Demo1,
    Footer,
  },
})
export default class HomeView extends Vue
{

}
</script>
