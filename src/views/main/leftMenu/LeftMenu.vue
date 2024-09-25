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
    .el-footer {--el-footer-height: 40px;display: flex;align-items: center;justify-content: flex-start;}
  }
</style>

<template>
  <el-container class="left-menu">
    <el-main style="padding: 0;">
      <el-tree v-show="byTree" class="el-tree" default-expand-all :data="nodelist" :props="defaultProps">
        <template #default="{ node, data }">
          <i :class="'iconfont '+ (node.level===1?'icon-mulu':'icon-tiaodu')"></i>
          <label v-if="node.level === 1">{{ data.namec }}</label>
          <el-tooltip placement="right" effect="light">
            <template #content>
              <img :src="data.data.src" :alt="data.data.name" style="object-fit: contain;height: var(--cells-img-height-col-2);width: 100px;"/>
            </template>
            <label v-if="node.level === 2"
              class="drag-label"
              draggable="true"
              @dragend.capture="handleDragEnd($event, data)"
              @contextmenu.prevent="handleRightClick($event, data)">
              {{ data.namec }}
            </label>
          </el-tooltip>
          <span v-if="data.counter">({{ data.counter }})</span>
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
    <el-footer>
      <el-button>
        <el-tooltip placement="top" effect="light">
          <template #content>
            <p>新增</p>
          </template>
          <i class="iconfont icon-xinjian"></i>
        </el-tooltip>
      </el-button>
      <el-button>
         <el-tooltip placement="top" effect="light">
          <template #content>
            <p>编辑</p>
          </template>
          <i class="iconfont icon-edit"></i>
        </el-tooltip>
      </el-button>
      <el-button @click="byTree = !byTree">
        <el-tooltip placement="top" effect="light">
          <template #content>
            <p>切换</p>
          </template>
          <i class="iconfont icon-qiehuanzhanghao"></i>
        </el-tooltip>
      </el-button>
    </el-footer>
  </el-container>
</template>

<script lang="ts" setup name="LeftMenu">
// 导入模块
import { ref, defineProps, defineEmits } from 'vue'
import { cellsList, cellNode, RightMenu } from '../../../components/interface/interfaceBase'
import { query } from '@/request'
import eveBus from '@/components/ts/eveBus'

const defaultProps = {
  children: 'children',
  label: 'namec',
}
// 接收参数
const props = defineProps({
  cellsList: { type: Array, default: () => [] },
  expandFirst: { type: Boolean, default: false },
})
let cellids:number[] = []
// 定义事件
const emit = defineEmits(['drag-end'])
// 定义变量
const nodelist = props.cellsList as Array<cellsList>
const expArr = ref<string[]>([])
const byTree = ref<boolean>(true)
const menus = ref<RightMenu[]>([
  {
    name: 'edit',
    namec: '编辑',
    icon: 'iconfont icon-copy',
    click: (node:cellNode) =>
    {
      console.log(node)
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
  }])
// 定义方法
function handleDragEnd(e:DragEvent, node:cellNode)
{
  emit('drag-end', {clientX:e.clientX, clientY:e.clientY, node})
}
function handleRightClick(e:MouseEvent, node:cellNode)
{
  e.preventDefault()
  eveBus.emit('right-menu', { e, menus: menus.value, data:node })
}
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
eveBus.on('count-node-num', async(data:any) =>
{
  data.cellids.forEach((id: any) => cellids.push(id))
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