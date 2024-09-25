<style scoped lang="less">
  .container { width: 100%;height: 100%;
    .tab-menu{width: 100%; height:var(--tab-menu-height);background: var(--tab-menu-bg-color);display: flex;align-items: center;
      .collapse-btn { padding: 10px;cursor: pointer;font-size:var(--icon-font-size);
        &:hover{color:var(--hover-color);}
      }
      .center{display: flex; flex: 1;}
      .lable{padding: var(--tab-menu-lable-padding);height: var(--tab-menu-height);line-height: var(--tab-menu-height);cursor: pointer;border-left: var(--tab-menu-left-border);font-size: 14px;
        &:hover{background:var(--color2);}
      }
    }
  }
</style>

<template>
  <el-container class="container">
    <el-aside :width="leftMenuW" style="padding: 0;">
      <left-menu :cellsList="cellsList_" expand-first @drag-end="handleDragEnd" />
    </el-aside>
    <el-main style="padding: 0;overflow: hidden;">
      <div class="tab-menu">
        <i class="collapse-btn" :class="`iconfont icon-${collapseL?'left':'right'}-arrow`" @click="collapseL=!collapseL"></i>
        <div class="center">
          <div class="lable"
            v-for="page in pageDirs"
            :key="page.name"
            :style="{background: page.name==selPage?'var(--tab-menu-check-bg-color)':''}"
            @click="selPage=page.name">
            <i class="iconfont icon-niantie"></i>{{ page.namec }}
          </div>
        </div>
        <i class="collapse-btn" :class="`iconfont icon-${!collapseR?'left':'right'}-arrow`" @click="collapseR=!collapseR"></i>
      </div>
      <div style="width: 100%;height: calc(100% - var(--tab-menu-height));">
        <graph-page v-if="ready" ref="childRef" :projectId="projectId" @accept-data="acceptData" />
      </div>
    </el-main>
    <el-aside :width="rightMenuW" style="padding: 0;">
      <cell-info :params="nodeInfo" :projectId="projectId"/>
    </el-aside>
    <el-dialog v-model="dialogVisible" width="500" draggable overflow :title="currentTabComponent?.title">
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
import { query } from '@/request'
import eveBus from '@/components/ts/eveBus'
// 引入接口
import common from '@/components/ts/common'
// 引入组件
import GraphPage from '@/views/main/GraphPage.vue'
import CellInfo from '@/views/main/cellInfo/CellInfo.vue'
import RightClickMenu from '@/components/RightClickMenu.vue'

// 定义变量
const store = useStore() // 使用useStore()函数获取store实例
const projectId = ref<number>(0)
const selPage = ref<string>('') // 当前图纸
const pageDirs = ref<Array<pageDirectory>>([]) // 图纸目录
const collapseL = ref<boolean>(false) // 左侧菜单栏是否折叠
const collapseR = ref<boolean>(true) // 右侧菜单栏是否折叠
const dialogVisible = ref<boolean>(false) // 弹窗是否显示
const childRef: Ref<graphRef | null> = ref(null) // 子组件的引用
const currentTabComponent: Ref<dlgComponent | null> = ref(null) // 当前弹窗组件
const cellsList_ = ref<cellsList[]>([]) // 原件列表
const nodeInfo = ref<{ [key: string]: any }>({}) // 结点信息
const LeftMenu = ref<ReturnType<typeof defineComponent> | null>(null) // 左侧菜单栏组件，用于动态加载
const rightClickMenu: Ref<RightMenuEvent | null> = ref(null)
const ready = ref<boolean>(false) // 是否加载完成
// 计算属性
const leftMenuW = computed(()=> // 获取左侧菜单宽度
{
  return (collapseL.value? store.state.leftMenuW:0) + 'px'
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
watch(() => selPage.value, (n) =>// 监听当前图纸
{
  const cur = pageDirs.value.find(page => page.name === n)
  if (cur)
  {
    projectId.value = cur.id
    nodeInfo.value = {
      ...cur, type: 'blank',
      description: {
        id: cur.id,
        key: cur.id,
        tabname: 'power_project',
        namec: cur.namec,
        icon: 'icon-huabu',
        classify: '电力仿真-画布'
      }
    }
  }
})

// 方法
function handleDragEnd({clientX, clientY, node}:any) // 结点拖拽结束
{
  childRef.value?.dragEnd(clientX, clientY, node)
}
function acceptData(params:any) // 接收子组件传来的数据
{
  if (params.type === 'blank')
  {
    const cur = pageDirs.value.find(page => page.name === selPage.value)
    if (cur)
    {
      nodeInfo.value = {
        ...cur, type: 'blank',
        description: {
          id: cur.id,
          key: cur.id,
          tabname:'power_project',
          namec: cur.namec, icon: 'icon-huabu', classify: '电力仿真-画布'
        }
      }
    }
  }
  else
  {
    if (!params.cell.data)
      return
    nodeInfo.value = params
    nodeInfo.value.description =
    {
      id: params.type === 'edge' ? params.cell.data.id : params.cell.data.prjnodeInfo.id,
      key: params.cell.id,
      tabname: params.type === 'edge' ? 'project_edges' : 'project_nodes',
      namec: params.type === 'edge' ? params.cell.data?.namec : params.cell.label,
      icon: params.type === 'edge' ? 'icon-xian' : 'icon-node',
      classify: params.type === 'edge' ? '连接线' : params.cell.data.namec
    }
  }
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
onMounted(async()=>
{
  let res = await query({ tabname: 'power_project' })
  if (res.status === 200)
  {
    ready.value = true
    pageDirs.value = res.data
  }
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