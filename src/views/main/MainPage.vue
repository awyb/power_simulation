<style scoped lang="less">
  .container { width: 100%;height: 100%;
    .tab-menu{width: 100%; height:var(--tab-menu-height);background: var(--tab-menu-bg-color);display: flex;align-items: center;
      .collapse-btn { height: var(--collapse-button-height);width: var(--collapse-button-width);background: var(--collapse-btn-color);color: var(--color2); border-radius: 0;
        .iconfont{font-size:var(--icon-font-size);
          &:hover{color:var(--hover-color);}
        }
      }
      .center{display: flex; flex: 1;}
      .lable{padding: var(--tab-menu-lable-padding);height: var(--tab-menu-height);line-height: var(--tab-menu-height);cursor: pointer;border-left: var(--tab-menu-left-border);}
    }
  }
</style>

<template>
  <el-container class="container">
    <el-aside :width="leftSideW" style="padding: 0;background: var(--left-aside-bg-color);">

    </el-aside>
    <el-aside :width="leftMenuW" style="padding: 0;">
      <left-menu :cellsList="cellsList_" expand-first @drag-end="handleDragEnd" />
    </el-aside>
    <el-main style="padding: 0;overflow: hidden;">
      <!-- <router-view></router-view> -->
      <div class="tab-menu">
        <el-button class="collapse-btn" type="text" @click="collapseL=!collapseL">
          <i :class="`iconfont icon-${collapseL?'left':'right'}-arrow`" />
        </el-button>
        <div class="center">
          <div class="lable"
            v-for="page in pageDirs"
            :key="page.name"
            :style="{background: page.name==selPage?'var(--tab-menu-check-bg-color)':''}"
            @click="selPage=page.name">
            <i class="iconfont icon-niantie"></i>{{ page.namec }}
          </div>
        </div>
        <el-button class="collapse-btn" type="text" @click="collapseR=!collapseR">
          <i :class="`iconfont icon-${!collapseR?'left':'right'}-arrow`"></i>
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
    <RightClickMenu ref="rightClickMenu"/>
  </el-container>
</template>

<script lang="ts" setup name="MainPage">
// 导入模块
import { onMounted, ref, Ref, computed, watch, defineAsyncComponent, defineComponent, onBeforeUnmount } from 'vue'
import { cellsList, dlgComponent, graphRef, pageDirectory, RightMenuEvent } from '@/components/interface/interfaceBase'
import { useStore } from 'vuex'
import eveBus from '@/components/ts/eveBus'
// 引入接口
import common from '@/components/ts/common'
// 引入组件
import GraphPage from '@/views/main/GraphPage.vue'
import CellInfo from '@/views/main/cellInfo/CellInfo.vue'
import RightClickMenu from '@/components/RightClickMenu.vue'
// 定义变量
const selPage = ref<string>('') // 当前图纸
const pageDirs = ref<Array<pageDirectory>>([{ name: 'page1', namec:'图纸1'}, {name: 'page2', namec:'图纸2'}]) // 图纸目录
const store = useStore() // 使用useStore()函数获取store实例
const collapseL = ref<boolean>(false) // 左侧菜单栏是否折叠
const collapseR = ref<boolean>(true) // 右侧菜单栏是否折叠
const dialogVisible = ref<boolean>(false) // 弹窗是否显示
const childRef: Ref<graphRef | null> = ref(null) // 子组件的引用
const currentTabComponent: Ref<dlgComponent | null> = ref(null) // 当前弹窗组件
const cellsList_ = ref<cellsList[]>([]) // 原件列表
const nodeInfo = ref<object>({type:'blank'}) // 结点信息
const LeftMenu = ref<ReturnType<typeof defineComponent> | null>(null) // 左侧菜单栏组件，用于动态加载
const rightClickMenu: Ref<RightMenuEvent | null> = ref(null)
// 计算属性
const leftMenuW = computed(()=> // 获取左侧菜单宽度
{
  return (collapseL.value? store.state.leftMenuW:0) + 'px'
})
const leftSideW = computed(()=> // 监听左侧侧边栏宽度
{
  return store.state.leftSideW + 'px'
})
const rightMenuW = computed(()=> // 获取右侧菜单宽度
{
  return (collapseR.value? store.state.rightMenuW:0)+ 'px'
})
// 监听
watch(()=>store.state.curComp, (n)=>// 动态组件接收
{
  dialogVisible.value = true
  currentTabComponent.value = n
})
// 方法
function handleDragEnd({clientX, clientY, node}:any) // 结点拖拽结束
{
  childRef.value?.dragEnd(clientX, clientY, node)
}
function acceptData(data:object) // 接收子组件传来的数据
{
  nodeInfo.value = data
}
function closeModal() // 关闭弹窗
{
  dialogVisible.value = false
}
async function initNodes() // 初始化结点
{
  const nodes = await common._getNodes()
  cellsList_.value = await common.getDirectory()
  cellsList_.value?.forEach((dir) =>
  {
    dir.children = nodes.filter((node) => node.data.glid === dir.id)
  })
  LeftMenu.value = defineAsyncComponent(() =>import('@/views/main/leftMenu/LeftMenu.vue'))
}
// 组件挂载
onMounted(()=>
{
  // 当组件挂载时，将collapseL和collapseR的值设置为true, 先让画布加载
  collapseL.value = true
  collapseR.value = true
  if (pageDirs.value.length)
    selPage.value = pageDirs.value[0].name
})
onBeforeUnmount(()=>
{
  eveBus.all.clear()
})
eveBus.on('right-menu', (params:any) =>
{
  rightClickMenu.value?.open(params.e, params.menus, params.data)
})
initNodes()
</script>