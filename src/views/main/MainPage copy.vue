<style scoped lang="less">
  .container { width: 100%;height: 100%;
    .tab-menu{width: 100%; height:var(--tab-menu-height);background: var(--tab-menu-bg-color);display: flex;align-items: center;
      .collapse-btn { height: var(--collapse-button-height);width: var(--collapse-button-width);background: var(--collapse-btn-color);color: var(--color2); border-radius: 0;
        .iconfont{font-size:var(--icon-font-size);
          &:hover{color:var(--hover-color);}
        }
      }
      .center{display: flex; flex: 1;}
      .lable{padding: var(--tab-menu-lable-padding);height: var(--tab-menu-height);line-height: var(--tab-menu-height);}
    }
  }
</style>

<template>
  <el-container class="container">
    <el-aside :width="leftSideW" style="padding: 0;background: var(--left-aside-bg-color);">
    </el-aside>
    <el-aside :width="leftMenuW" style="padding: 0;">
       <left-menu :cellsList="cellsList" @drag-end="handleDragEnd" />
    </el-aside>
    <el-main style="padding: 0;overflow: hidden;">
      <!-- <router-view></router-view> -->
      <div class="tab-menu">
        <el-button class="collapse-btn" type="text" @click="collapseL=!collapseL">
          <i :class="`iconfont icon-${collapseL?'left':'right'}-arrow`" />
        </el-button>
        <div class="center">
          <div class="lable"><i class="iconfont icon-niantie"></i>图纸1</div>
          <div class="lable" style="background: white;"><i class="iconfont icon-niantie"></i>图纸2</div>
        </div>
        <el-button class="collapse-btn" type="text" @click="collapseR=!collapseR">
           <i :class="`iconfont icon-${!collapseR?'left':'right'}-arrow`" />
        </el-button>
      </div>
      <div style="width: 100%;height: calc(100% - var(--tab-menu-height));">
        <graph-page ref="childRef" :widthL="parseInt(leftMenuW)" @accept-data="acceptData" />
      </div>
    </el-main>
    <el-aside :width="rightMenuW" style="padding: 0;">
      <cell-info :params="nodeInfo" />
    </el-aside>
    <el-dialog v-model="dialogVisible"
      width="500"
      draggable
      overflow
      :title="currentTabComponent?.title">
      <component v-bind:is="currentTabComponent?.comp"
        @read-success="currentTabComponent?.onOk"
        @close="closeModal"
        :key="currentTabComponent?.id"/>
    </el-dialog>
  </el-container>
</template>

<script lang="ts" setup name="MainPage">
import { onMounted, ref, Ref, computed, watch, defineAsyncComponent, defineComponent } from 'vue'
import { cellsList, cellNode, component, graphRef } from '@/components/interface/interfaceBase'
import { useStore } from 'vuex'
// import { useRouter } from 'vue-router'

import common from '@/components/ts/common'

import GraphPage from '@/views/main/GraphPage.vue'
import CellInfo from '@/views/main/CellInfo.vue'
// import LeftMenu from '@/views/main/leftMenu/LeftMenu.vue'


const store = useStore()
const collapseL = ref<boolean>(true)
const collapseR = ref<boolean>(true)
const dialogVisible = ref<boolean>(false)
// const router = useRouter()
// const childRef = ref(null)
// router.push('/demo1')
const childRef: Ref<graphRef | null> = ref(null)
const currentTabComponent: Ref<component | null> = ref(null)
// 列表
const cellsList = ref<cellsList[]>([])
const nodeInfo = ref<object>({})
const LeftMenu = ref<ReturnType<typeof defineComponent> | null>(null)
   
const leftMenuW = computed(()=>
{
  return (collapseL.value? store.state.leftMenuW:0) + 'px'
})
const leftSideW = computed(()=>
{
  return store.state.leftSideW + 'px'
})
const rightMenuW = computed(()=>
{
  return (collapseR.value? store.state.rightMenuW:0)+ 'px'
})
watch(()=>store.state.curComp, (n)=>
{
  dialogVisible.value = true
  currentTabComponent.value = n
})
function getVarVal(varName:string)
{
  return getComputedStyle(document.documentElement).getPropertyValue(varName)
}
function handleDragEnd({clientX, clientY, node}:any)
{
  childRef.value?.dragEnd(clientX, clientY, node)
}
function acceptData(data:object)
{
  nodeInfo.value = data
}
function calcDis(a:string|number, b:string|number, ...args:(string|number)[])
{
  let dis = parseInt(a as string) + parseInt(b as string)
  args.forEach(n=>
  {
    dis += parseInt(n as string)
  })
  return dis + 'px'
}
function closeModal()
{
  dialogVisible.value = false
}
async function initNodes()
{
  const nodes = common.getNodes()
  cellsList.value = await common.getDirectory()
  cellsList.value?.forEach((dir) =>
  {
    dir.children = nodes.filter((node) => node.data.glid === dir.id)
  })
  LeftMenu.value = defineAsyncComponent(() =>import('@/views/main/leftMenu/LeftMenu.vue'))
}
initNodes()
onMounted(()=>
{
  collapseL.value = true
  collapseR.value = true
})

</script>