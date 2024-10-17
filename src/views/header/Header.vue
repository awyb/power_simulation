<style lang="less">
.header { display: flex; align-items: center; width: 100%; height: 100%; background: var(--header-bg-color);
  .el-row { height: 80%; width: 100%;
    .el-col { display: flex; align-items: center; height: 100%; }
    .left { justify-content: flex-start;
      &:first-child { padding-left:var(--header-left); }
    }
    .center { justify-content: center;
      .dot {display: inline-block;width: 8px; height: 8px; background-color: black; border-radius: 50%; margin-right: 5px;vertical-align: middle; }
    }
    .right { justify-content: flex-end;
      &:last-child { padding-right:var(--header-right); }
    }
  }
  .logo { height: 80%; }
  .oper-box { cursor: pointer; }
  .iconfont { font-size: var(--icon-font-size); margin-left: var(--header-icon-distance); color: var(--color3); }
}
</style>
<template>
  <div class="header">
    <el-row justify="space-between">
      <el-col :span="7" class="left">
        <img class="logo" src="../../../public/static/image/logo/power_logo.png" alt="logo" />
        <span v-for="btn in btns" :key="btn.key" class="oper-box" @click="btn.click">
          <el-tooltip :content="btn.title" placement="bottom">
            <i :class="btn.icon"></i>
          </el-tooltip>
        </span>
      </el-col>
      <el-col :span="7" class="center">
        <label><span v-show="needSave" class="dot"></span>测试项目一</label>
      </el-col>
      <el-col :span="7" class="right">
        <span class="oper-box" @click="fullClick">
          <el-tooltip :content="fullConfig.content" placement="bottom">
            <i :class="fullConfig.icon"></i>
          </el-tooltip>
        </span>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup name="Header">
import eveBus from '@/components/ts/eveBus'
import { computed, reactive } from 'vue'
import { FullConfig } from './header'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
const store = useStore()
const { t } = useI18n()
const btns = [
  { key: 'open', title: t('header.btn.open'), icon: 'iconfont icon-dakaiwenjianjia', click: handleOpen },
  { key: 'save', title: t('header.btn.save'), icon: 'iconfont icon-baocun', click: handleSave },
  { key: 'import', title: t('header.btn.import'), icon: 'iconfont icon-daoru', click: handleImport },
  { key: 'export', title: t('header.btn.export'), icon: 'iconfont icon-daochu', click: handleExport }
]
const fullConfig: FullConfig = reactive({
  content: t('header.btn.full-screen'),
  icon:'iconfont icon-fullscreen'
})
const needSave = computed(() =>
{
  return store.state.needSave
})
let isFull = false
function fullClick()
{
  isFull = !isFull
  fullConfig.content = isFull ? t('header.btn.exit-full-screen') : t('header.btn.full-screen')
  fullConfig.icon = isFull ? 'iconfont icon-quxiaoquanping' : 'iconfont icon-fullscreen'
  isFull ? document.documentElement.requestFullscreen() : document.exitFullscreen()
}
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