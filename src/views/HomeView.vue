<style scoped lang="less">
  .home { position: relative;width: 100%;height: 100%;
    .container {  height: 100%;
      .el-header { padding: 0;}
      .el-main { padding: 0;position: relative;overflow: hidden;}
      .el-footer { padding: 0;}
    }
  }
  .left-aside-btn{color: aliceblue;text-align: center;margin-top:20px;cursor: pointer;
    .iconfont{font-size: 24px;}
  }
</style>

<template>
  <div class="home">
    <el-container class="container">
      <el-header :height="pageHeaderH" >
        <Header></Header>
      </el-header>
      <el-main>
        <el-container class="container">
          <el-aside :width="leftSideW" style="padding: 0;background: var(--left-aside-bg-color);">
            <div @click="runPlug('design')" class="left-aside-btn">
              <i class="iconfont icon-design" :style="{color:checkName==='design'?'#ffffff':'#959595'}"></i>
            </div>
             <div @click="runPlug('run')" class="left-aside-btn">
              <i class="iconfont icon-yunhang" :style="{color:checkName==='run'?'#ffffff':'#959595'}"></i>
            </div>
          </el-aside>
          <el-main>
            <router-view v-slot="{Component}">
              <transition name="router-fade" mode="out-in">
                <keep-alive>
                  <component :is="Component"/>
                </keep-alive>
              </transition>
            </router-view>
          </el-main>
        </el-container>
      </el-main>
      <el-footer :height="pageFooterH">
        <Footer></Footer>
      </el-footer>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Header from '@/views/header/Header.vue'
import Footer from '@/views/footer/Footer.vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'

const store = useStore()
const router:any = useRouter()
const pageHeaderH = store.state.pageHeaderH + 'px'
const pageFooterH = store.state.pageFooterH + 'px'
const leftSideW = store.state.leftSideW + 'px'
const checkName = ref('design')
document.addEventListener('keydown', (event: KeyboardEvent)=>
{
  if (event.ctrlKey && event.key.toLowerCase() === 's')
  {
    event.preventDefault()
    // 在这里执行你想要的操作
    store.dispatch('variable/update')
    store.dispatch('savePage/update')
    store.commit('changeNeedSave', false)
  }
})

router.push('/design')
const iskeepAlive = computed(() =>
{
  if (router.currentRoute&&router.currentRoute.meta&&router.currentRoute.meta.keepAlive)
    return true
  return false
})
function runPlug(routerName: string)
{
  checkName.value = routerName
  router.push('/'+routerName)
}
</script>
