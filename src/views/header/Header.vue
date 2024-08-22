<style lang="less">
.header {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #e8e8e8;

  .el-row {
    height: 80%;
    width: 100%;

    .el-col {
      display: flex;
      align-items: center;

      height: 100%;
    }
  }

  .logo {
    height: 80%;
    margin-left: 10px
  }

  .oper-box {
    cursor: pointer;
  }

  .iconfont {
    font-size: 20px;
    margin-left: 20px;
  }
}
</style>
<template>
  <div class="header">
    <el-row justify="space-between">
      <el-col :span="7">
        <img class="logo" src="../../../public/static/image/logo/power_logo.png" alt="logo" />
        <span v-for="btn in btns" :key="btn.key" class="oper-box" @click="btn.click">
          <el-tooltip :content="btn.title" placement="bottom">
            <i :class="btn.icon"></i>
          </el-tooltip>
        </span>
      </el-col>
      <el-col :span="7" style="justify-content: center;">
        <label>未命名项目-</label>
      </el-col>
      <el-col :span="7"></el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import eveBus from '@/components/eveBus'
const btns = [
  { key: 'open', title: '打开', icon: 'iconfont icon-dakaiwenjianjia', click: handleOpen },
  { key: 'save', title: '保存', icon: 'iconfont icon-baocun', click: handleSave },
  { key: 'import', title: '导入', icon: 'iconfont icon-daoru', click: handleImport },
  { key: 'export', title: '导出', icon: 'iconfont icon-daochu', click: handleExport }
]
function handleOpen()
{
  console.log('打开')
}

function handleSave()
{
  console.log('保存')
}

function handleImport()
{
  eveBus.emit('graph-import-toJson')
}

function handleExport()
{
  eveBus.emit('graph-export-toJson')
}
</script>