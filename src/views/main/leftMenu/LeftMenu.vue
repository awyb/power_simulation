<style scoped lang="less">
  .el-container { height: 100%;width: 100%;background: var(--color1);
    /deep/ .el-collapse-item__header { padding-left:var(--collapse-padding-left); }
    /deep/ .el-collapse { --el-collapse-border-color: var(--collapse-border-color); }
    /deep/ .el-collapse:first-of-type{border: none;}
    .drag-box { float: left;margin: 10px;padding: 5px; text-align: center;cursor: pointer;
      &:hover { background: var(--cells-hover-color);}
    }
    .col-2{ width: calc(50% - 30px);
      img { height: var(--cells-img-height-col-2); }
    }
    .col-3{ width: calc(30% - 20px);
      img { height: var(--cells-img-height-col-3); }
    }
  }
</style>

<template>
  <el-container>
    <el-collapse v-model="expArr" style="width: 100%;">
      <el-collapse-item v-for="item in nodelist" :name="item.name" :title="item.namec" :key="item.name">
        <div class="drag-box col-2"
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
  </el-container>
</template>

<script lang="ts" setup name="LeftMenu">
// 导入模块
import { ref, defineProps, defineEmits} from 'vue'
import { cellsList, cellNode, RightMenu } from '../interfaceBase'
import eveBus from '@/components/ts/eveBus'


// 接收参数
const props = defineProps({
  cellsList: { type: Array, default: () => [] },
  expandFirst: { type: Boolean, default: false },
})
// 定义事件
const emit = defineEmits(['drag-end'])
// 定义变量
const nodelist = props.cellsList as Array<cellsList>
const expArr = ref<string[]>([])
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
// 初始化
if (props.expandFirst&&nodelist.length)
  expArr.value.push(nodelist[0].name)
</script>