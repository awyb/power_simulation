<style scoped lang="less">
  .container { width: 100%;height: 100%;
    .collapse-btn { position: absolute;top: 0;height: var(--collapse-button-height);width: var(--collapse-button-width);z-index:10;}
    /deep/ .el-collapse-item__header { padding-left:20px;}
    .drag-box { float: left;cursor: pointer;margin: 10px;padding: 5px; width: calc(30% - 20px);text-align: center;
      &:hover { background: #c1c1c18e}}
    img { width: 100%;height: 60px;object-fit: contain;}
    /deep/ .el-collapse {--el-collapse-border-color: #d9d9d9;}
    .top-menu{height:30px;background: #e8e8e880;position: absolute;z-index:9;}
  }
</style>

<template>
  <el-container class="container">
    <el-aside :width="leftSideW" style="padding: 0;background: #484848;">
      
    </el-aside>
    <el-aside :width="collapseL?leftMenuW:'0px'" style="padding: 0;">
      <div style="width: 100%;height: 100%;background: #f3f3f3;">
        <el-collapse v-model="expArr">
          <el-collapse-item name="1" title="电气-基本无源元件">
            <div v-for="item in moduleList.filter(n=>n.type===1)"
              :key="item.id"
              draggable="true"
              @dragend="handleDragEnd($event, item)"
              @contextmenu="handleRightClick($event, item)"
              class="drag-box">
              <el-tooltip placement="right" effect="light">
                <img :src="item.src" alt="" />
                <template #content>
                  <p>{{ item.name }}</p>
                </template>
              </el-tooltip>
            </div>
          </el-collapse-item>
          <el-collapse-item name="2" title="原件测试二">
            <div v-for="item in moduleList.filter(n=>n.type>2)"
              :key="item.id"
              draggable="true"
              @dragend="handleDragEnd($event, item)"
              @contextmenu="handleRightClick($event, item)"
              class="drag-box">
              <el-tooltip placement="right" effect="light">
                <img :src="item.src" alt="" />
                <template #content>
                  <p>{{ item.name }}</p>
                </template>
              </el-tooltip>
            </div>
          </el-collapse-item>
          <el-collapse-item name="3" title="电气-三相交流元件">
            <div v-for="item in moduleList.filter(n=>n.type===2)"
              :key="item.id"
              draggable="true"
              @dragend="handleDragEnd($event, item)"
              @contextmenu="handleRightClick($event, item)"
              class="drag-box">
              <el-tooltip placement="right" effect="light">
                <img :src="item.src" alt="" />
                <template #content>
                  <p>{{ item.name }}</p>
                </template>
              </el-tooltip>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-aside>
    <el-main style="padding: 0;overflow: hidden;">
      <!-- <router-view></router-view> -->
      <Demo1 ref="childRef" @accept-data="acceptData" :widthL="collapseL?parseInt(leftMenuW):0"/>
    </el-main>
    <el-aside :width="collapseR?rightMenuW:'0px'" style="padding: 0;">
      <div style="width: 100%;height: 100%;background: #f3f3f3;">
        <cell-info :params="nodeInfo"></cell-info>
      </div>
    </el-aside>
    <RightClickMenu ref="rightClickMenu" :menus="[1]"></RightClickMenu>
    <el-button class="collapse-btn" type="text" :style="{left:collapseL?calcDis(leftMenuW,leftSideW):leftSideW}" @click="collapseL=!collapseL" :icon="collapseL?DArrowLeft:DArrowRight" />
    <el-button class="collapse-btn" type="text" :style="{right:collapseR?calcDis(rightMenuW,10):'10px'}" @click="collapseR=!collapseR" :icon="!collapseR?DArrowLeft:DArrowRight" />
    <div class="top-menu" :style="{width: `calc(100% - ${calcDis(90,leftMenuW,rightMenuW)})`,left:calcDis(leftMenuW,40)}">
      <div style="background: white;height: 100%;width: fit-content;"><span style="padding: 5px 50px;">图纸1</span></div>
    </div>
    <el-dialog v-model="dialogVisible"
      width="500"
      draggable
      overflow
      :title="currentTabComponent?.title"
     >
      <component v-bind:is="currentTabComponent?.comp" @read-success="currentTabComponent?.onOk" @close="closeModal" :key="currentTabComponent?.id"></component>
    </el-dialog>
  </el-container>
</template>

<script lang="ts">
import { DArrowRight, DArrowLeft } from '@element-plus/icons-vue'
import { defineComponent, onMounted, ref, onBeforeUnmount, Ref, computed, watch, reactive} from 'vue'
// import { useRouter } from 'vue-router'
import Demo1 from '@/views/main/Demo1.vue'
import common from '@/components/common'
import RightClickMenu from '@/components/RightClickMenu.vue'
import CellInfo from '@/views/main/CellInfo.vue'
import { useStore } from 'vuex'

interface HTMLElement
{
  dragEnd: (x:number, y:number, config:object) => void
  open: (e:MouseEvent, item:Img) => void
}
interface Img
{
  id: number,
  name: string,
  src: string,
  type:number,
  config: object
}
interface component
{
  id: number,
  comp: component,
  title: string,
  onOk: () => void
}

export default defineComponent({
  name: 'MainPage',
  components:
  {
    Demo1,
    RightClickMenu,
    'cell-info':CellInfo
  },
  setup()
  {
    const store = useStore()
    const collapseL = ref<boolean>(true)
    const collapseR = ref<boolean>(true)
    const dialogVisible = ref<boolean>(false)
    // const router = useRouter()
    // const childRef = ref(null)
    // router.push('/demo1')
    const childRef: Ref<HTMLElement | null> = ref(null)
    const rightClickMenu: Ref<HTMLElement | null> = ref(null)
    const currentTabComponent: Ref<component | null> = ref(null)
    // 列表
    const moduleList = ref<Img[]>([])
    const expArr = ref<string[]>(['3'])
    const nodeInfo = ref<object>({})

    const nodes = common.getNodes()
    nodes.forEach((node, index)=>
    {
      const t: Img =
      {
        id: index,
        name: node.namec,
        type: node.data.type,
        src: node.attrs.image['xlink:href'],
        config: node
      }
      moduleList.value.push(t)
    })
    const handleDragEnd=(e:DragEvent, item:Img)=>
    {
      childRef.value?.dragEnd(e.clientX, e.clientY, item.config)
    }
    const acceptData = (data:object)=>
    {
      nodeInfo.value = data
    }
    const handleRightClick=(e:MouseEvent, item:Img)=>
    {
      e.preventDefault()
      rightClickMenu.value?.open(e, item)
    }
    const leftMenuW = computed(()=>
    {
      return store.state.leftMenuW + 'px'
    })
    const leftSideW = computed(()=>
    {
      return store.state.leftSideW + 'px'
    })
    const rightMenuW = computed(()=>
    {
      return store.state.rightMenuW + 'px'
    })
    watch(()=>store.state.curComp, (n)=>
    {
      dialogVisible.value = true
      currentTabComponent.value = n
    })
    
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
    onMounted(()=>
    {
      collapseL.value = true
      collapseR.value = true
    })
    return {
      leftMenuW,
      rightMenuW,
      leftSideW,
      childRef,
      rightClickMenu,
      collapseR,
      collapseL,
      expArr,
      nodeInfo,
      moduleList,
      dialogVisible,
      currentTabComponent,
      DArrowRight,
      DArrowLeft,
      handleDragEnd,
      handleRightClick,
      acceptData,
      calcDis,
      closeModal
    }
  }
})
</script>