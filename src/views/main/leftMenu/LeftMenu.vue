<style scoped lang="less">
  .el-container { height: 100%;width: 100%;background: var(--color1);
    /deep/ .el-collapse-item__header { padding-left:var(--collapse-padding-left); }
    /deep/ .el-collapse { --el-collapse-border-color: var(--collapse-border-color); }
    /deep/ .el-collapse:first-of-type{border: none;}
    .drag-box { float: left;margin: 10px;padding: 5px; text-align: center;cursor: pointer;
      &:hover { background: var(--cells-hover-color);}
    }
    .el-tree{ background: transparent;
      .iconfont { margin-right: 10px; }
      .drag-label{cursor: pointer;}
      /deep/ .el-tree-node__content { height: 40px; }
    }
    .col-2{ width: calc(50% - 30px);
      img { height: var(--cells-img-height-col-2); }
    }
    .col-3{ width: calc(30% - 20px);
      img { height: var(--cells-img-height-col-3); }
    }
    .el-header {--el-header-height: 30px;display: flex;align-items: center;justify-content: flex-start;border-bottom: 1px solid var(--collapse-border-color);}
  }
</style>

<template>
  <el-container class="left-menu">
    <el-header>
      <el-tooltip placement="top" effect="light">
        <template #content>
          <p>切换</p>
        </template>
        <i class="iconfont icon-qiehuanzhanghao" @click="byTree = !byTree"></i>
      </el-tooltip>
    </el-header>
    <el-main style="padding: 0;">
      <el-tree v-show="byTree" class="el-tree" highlight-current default-expand-all :data="nodelist" :props="defaultProps">
        <template #default="{ node, data }">
          <label v-if="node.level === 1">
            <i class="iconfont icon-mulu"></i>
            <span>{{ data.namec }}</span>
            <span v-if="data.counter">({{ data.counter }})</span>
          </label>
          <el-tooltip placement="top" effect="light">
            <template #content>
              <img :src="data.data.src" :alt="data.data.name" style="object-fit: contain;height: var(--cells-img-height-col-2);width: 100px;"/>
            </template>
            <label v-if="node.level === 2"
              class="drag-label"
              draggable="true"
              @dragend.capture="handleDragEnd($event, data)"
              @contextmenu.prevent="handleRightClick($event, data)">
              <i class="iconfont icon-tiaodu"></i>
              <span>{{ data.namec }}</span>
              <span v-if="data.counter">({{ data.counter }})</span>
            </label>
          </el-tooltip>
        </template>
      </el-tree>
      <el-collapse v-show="!byTree" v-model="expArr" style="width: 100%;">
        <el-collapse-item v-for="item in nodelist" :name="item.name" :title="item.namec" :key="item.name">
          <div class="drag-box col-3"
            v-for="node in item.children"
            :key="node.data.entityid"
            draggable="true"
            @dragend.capture="handleDragEnd($event, node)"
            @contextmenu.prevent="handleRightClick($event, node)">
            <el-tooltip placement="right" effect="light">
              <img :src="node.data.src" :alt="node.data.name" style="width: 100%;object-fit: contain;"/>
              <template #content>
                <p>{{ node.namec }}</p>
              </template>
            </el-tooltip>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup name="LeftMenu">
// 导入模块
import { ref, defineProps, defineEmits, watch } from 'vue'
import { cellsList, cellNode, RightMenu } from '../../../components/interface/interfaceBase'
import { query } from '@/request'
import eveBus from '@/components/ts/eveBus'
import { useStore } from 'vuex'

const store = useStore()
const defaultProps = {
  children: 'children',
  label: 'namec',
}
// 接收参数
const props = defineProps({
  cellsList: { type: Array, default: () => [] },
  expandFirst: { type: Boolean, default: false },
  tableData: { type: Array, default: () => [] },
})
// 定义事件
const emit = defineEmits(['drag-end'])
// 定义变量
const nodelist = props.cellsList as Array<cellsList>
const expArr = ref<string[]>([])
const byTree = ref<boolean>(true)
const preview = ref<HTMLElement | null>(null)
const menus = ref<RightMenu[]>([
  {
    name: 'edit',
    namec: '编辑',
    icon: 'iconfont icon-copy',
    click: async(node:cellNode) =>
    {
      const comp = await import('./DialogEdit.vue').then(module => module.default)
      store.dispatch('changeUrl',
        {
          comp,
          id: Math.random(),
          attr: {
            draggable: true,
            'close-on-click-modal': false,
            'append-to-body': true,
            'z-index': 1,
          },
          modal: false,
          title: '编辑',
          params:node,
          onOk: (att: any) =>
          {
            console.log(att)
          }
        })
    },
  },
  {
    name: 'delete',
    namec: '删除',
    icon: 'iconfont icon-shanchu',
    click: (node:cellNode) =>
    {
      console.log(node)
    },
  }
])

let cellids:number[] = []


watch(() => props.tableData, () =>
{
  cellids.length = 0
  props.tableData.forEach((item: any) => cellids.push(item.cellid))
  countIt()
}, { deep: true, immediate: true })

// 定义方法

// 拖拽结束
function handleDragEnd(e:DragEvent, node:cellNode)
{
  emit('drag-end', { clientX: e.clientX, clientY: e.clientY, node })
}

// 右键菜单
function handleRightClick(e:MouseEvent, node:cellNode)
{
  e.preventDefault()
  eveBus.emit('right-menu', { e, menus: menus.value, data:node })
}
// 统计结点数量
function countIt()
{
  nodelist.forEach(node =>
  {
    if (node.children)
    {
      let c = 0
      node.children.forEach(child =>
      {
        child.counter = cellids.filter(id => child.data.id === id).length
        c += child.counter
      })
      node.counter = c
    }
    else
      node.counter = 0
  })
}

eveBus.on('node-delete', async(data:any) =>
{
  const index = cellids.indexOf(data.cellid)
  if (index > -1)
  {
    cellids.splice(index, 1)
    countIt()
  }
})
eveBus.on('node-add', async(data:any) =>
{
  cellids.push(data.cellid)
  countIt()
})
// 初始化
query({ tabname: 'default_config', exp: `keyname = 'cells_list_expand'` }).then(res =>
{
  if (res.status === 200&&res.data.length)
  {
    const vals = JSON.parse(res.data[0].config)
    vals.forEach((item: string) => expArr.value.push(item))
  }
})

</script>