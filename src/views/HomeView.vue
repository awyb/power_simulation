<style scoped lang="less">
  .home { position: relative;width: 100%;height: 100%;
    .container {  height: 100%;
      .el-header { padding: 0;}
      .el-main { padding: 0;position: relative;overflow: hidden;}
      .el-footer { padding: 0;}
    }
  }
</style>

<template>
  <div class="home">
    <el-container class="container">
      <el-header :height="pageHeaderH" >
        <Header></Header>
      </el-header>
      <el-main>
        <MainPage></MainPage>
      </el-main>
      <el-footer :height="pageFooterH">
        <Footer></Footer>
      </el-footer>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { useStore } from 'vuex'
import Header from '@/views/header/Header.vue'
import MainPage from '@/views/main/MainPage.vue'
import Footer from '@/views/footer/Footer.vue'
@Options({
  components:
  {
    Header,
    Footer,
    MainPage
  }
})
export default class HomeView extends Vue
{
  private store = useStore()
  public pageHeaderH = this.store.state.pageHeaderH + 'px'
  public pageFooterH = this.store.state.pageFooterH + 'px'
  created(): void
  {
    this.store.dispatch('variable/init')
  }
}
</script>
