<style scoped lang="less">
  .home { position: relative;width: 100%;height: 100%;
    .container {  height: 100%;}
  }
</style>

<template>
  <div class="home">
    <el-container class="container">
      <el-header height="5%" style="padding: 0;">
        <Header></Header>
      </el-header>
      <el-main height="90%" style="padding: 0;">
        <!-- <Main></Main> -->
        <MainPage></MainPage>
      </el-main>
      <el-footer height="5%" style="padding: 0;">
        <!-- <Footer></Footer> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Header from '@/views/header/Header.vue'
import Main from '@/views/main/Main.vue'
import MainPage from '@/views/main/MainPage.vue'
import Demo1 from '@/views/main/Demo1.vue'

import Footer from '@/views/footer/Footer.vue'
@Options({
  components:
  {
    Header,
    // Main,
    Demo1,
    Footer,
    MainPage
  },
})
export default class HomeView extends Vue
{

}
</script>
