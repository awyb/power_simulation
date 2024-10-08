<style scoped lang="less">
  .home { position: relative;width: 100%;height: 100%;
    .container {  height: 100%;
      .el-header { padding: 0;}
      .el-main { padding: 0;position: relative;overflow: hidden;
        .main-aside { padding: 0;background: var(--left-aside-bg-color);display: flex;flex-direction: column;align-items: center;justify-content: space-between;
          .left-aside-btn { color: aliceblue;text-align: center;cursor: pointer;
            .iconfont { font-size: 24px;
              &:hover { color:var(--aside-btn-hover-color) !important; }
            }
          }
          .top { margin-top:20px; }
          .bottom { margin-bottom: 20px; }
        }
        .main-content {
          .console-box { position: relative;
            .console-line { color: rgb(133, 133, 133);font-size: 12px;margin: 10px 5px;
              label:nth-of-type(1) { display: inline-block;width: 80px; }
              label:nth-of-type(2) { margin-right:20px; }
              label:nth-of-type(3) { font-size: 10px;display: inline-block;width: 80px; }
              label:nth-of-type(4) { margin-left:20px; }
            }
            .resizer { position: sticky;top: 0;right: 0;width: 100%;height: 3px;cursor: ns-resize;background-color: rgb(232,232,232);
              &:hover { height: 3px;background-color: rgb(0, 132, 255); }
            }
            .oper-tools { position: absolute; right: 20px;top: 8px; font-size:18px; cursor: pointer; z-index:99;
              .iconfont { margin-left: 10px;
                &:hover { color: rgb(0, 132, 255); }
              }
            }
            .console-tab { height: 100%;display: flex;flex-direction: column;
              /deep/.el-tabs__content { flex-grow: 1;}
              /deep/.el-tab-pane { height: 100%; }
              /deep/.el-tabs__item { font-size: 12px; }
              /deep/.el-tabs__header { --el-tabs-header-height: 30px;background-color: var(--color1); }
            }
            .console-content { background: rgb(255, 255, 255);height: 100%;overflow: auto; }
            .output {display: flex;}
          }
        }
      }
      .el-footer { padding: 0;}
    }
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
          <el-aside :width="leftSideW" class="main-aside">
            <div v-for="item in btnsAside" :key="item.layout">
              <div v-for="(btn,index) in item.list"  @click="btn.click" :key="index" :class="'left-aside-btn '+item.layout" >
                <el-tooltip placement="right" effect="light">
                  <template #content>
                    <p>{{ btn.namec }}</p>
                  </template>
                  <i :class="btn.icon" :style="{color:checkName===btn.name?'var(--aside-btn-color)':'var(--aside-btn-active-color)'}"></i>
                </el-tooltip>
              </div>
            </div>
          </el-aside>
          <el-main class="main-content">
            <el-container class="container">
              <el-main style="padding: 0;">
                <router-view v-slot="{Component}">
                  <transition name="router-fade" mode="out-in">
                    <keep-alive>
                      <component :is="Component" :tableData="tableData" @update-project="initTable"/>
                    </keep-alive>
                  </transition>
                </router-view>
              </el-main>
              <el-footer :height="pageFooterH+'px'" class="console-box">
                <div class="resizer" @mousedown="startResizing"></div>
                <div class="oper-tools">
                  <i class="iconfont icon-close" @click="closeConSole"></i>
                </div>
                <el-tabs type="border-card" class="console-tab" v-model="activeTab">
                  <el-tab-pane label="日志" name="log">
                    <div class="console-content" ref="loginfo">
                      <div v-for="(info,index) in outInfo" :key="index" class="console-line">
                        <label>>>line {{index+1}}：</label>
                        <label>{{ info.time }}</label>
                        <label :style="{'color':color[info.type]}">
                          {{ info.type }}
                        </label>
                        <label>{{ info.describe }}</label>
                      </div>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="输出" lazy name="output">
                    <div class="console-content output" v-if="checkPass">
                      <dyn-line style="height: 400px;width: 600px;margin:5px;" :func="['logBase','cosBase','inverseBase']"></dyn-line>
                      <dyn-line style="height: 400px;width: 600px;margin:5px;" :func="['sinBase','expBase']"></dyn-line>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="模型表" name="model">
                    <el-table
                      border stripe
                      size="small"
                      style="width: 96%;margin: auto;"
                      :data="filterTableData"
                      :header-cell-style="{background:'#f5f7fa',color:'#606266'}">
                      <el-table-column type="index" width="80" fixed align="center" label="序号"/>
                      <el-table-column sortable
                        v-for="(fld,index) in flds.filter(i=>i.disporder)"
                        :key="index"
                        :prop="fld.name"
                        :label="fld.namec" width="240"/>
                      <el-table-column align="center" fixed="right" width="200">
                        <template #header>操作</template>
                        <template #default="scope">
                          <el-button size="small" @click="handleEdit(scope.$index, scope.row)" type="text">
                            编辑
                          </el-button>
                          <el-button size="small" @click="handleLocation(scope.$index, scope.row)" type="text">
                            定位
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-tab-pane>
                  <el-tab-pane label="其他" name="other">

                  </el-tab-pane>
                </el-tabs>
              </el-footer>
            </el-container>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
    <dialog-plus v-model="showDialog" :close-on-click-overlay="false" :uicfg="{ modal: false }">
      <template #content>
        {{flds}}
      </template>
    </dialog-plus>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ref, onMounted, nextTick, computed } from 'vue'
import { initDB, getCacheData, setDataInDB } from './main/init'
import Header from '@/views/header/Header.vue'
import DynLine from '@/views/main/run/DynLine.vue'
import DialogPlus from '@/components/DialogPlus.vue'
import { query } from '@/request'
import eveBus from '@/components/ts/eveBus'
interface OutInfo{
  time: string,
  type: string,
  describe: string
}
let isResizing = false
let startY = 0
let startHeight = 0
let minHeight = 2

const showDialog = ref(false)
const store = useStore()
const router = useRouter()
const pageHeaderH = store.state.pageHeaderH + 'px'
const leftSideW = store.state.leftSideW + 'px'
const checkName = ref('design')
const pageFooterH = ref<number>(minHeight) // 初始宽度
const outInfo = ref<OutInfo[]>([{time: new Date().toLocaleString(), type: 'PRIMARY', describe: '欢迎进入电力仿真平台！'}])
const loginfo = ref<HTMLElement | null>(null)
const tableData = ref<any[]>([])
const flds = ref<any[]>([])
const color:any = {
  'SUCCESS': '#67C23A',
  'WARNING': '#E6A23C',
  'ERROR': '#F56C6C',
  'INFO': '#909399',
  'PRIMARY': '#409EFF'
}
const activeTab = ref('model')
const checkPass = ref<boolean>(false)
const btnsAside = [
  {
    layout: 'top', list: [
      { name: 'design', icon: 'iconfont icon-drawing', namec: '设计', class: 'top', click:()=> runPlug('design')},
      { name: 'run', icon: 'iconfont icon-running', namec: '运行', class: 'top', click: () => runPlug('run') },
      { name: 'check', icon: 'iconfont icon-inspection', namec: '检查', class: 'top', click:()=> checkData() },
    ],
  },
  {
    layout: 'bottom', list: [
      { name: 'account', icon: 'iconfont icon-user', namec: '账户', click: () => showDialog.value = true },
      { name: 'setting', icon: 'iconfont icon-setting', namec: '管理', click: () => console.log('setting') },
    ]
  }
]
const search = ref('')
const filterTableData = computed(() =>
  tableData.value.filter(
    (data:any) =>
      !search.value ||
      data.namec.toLowerCase().includes(search.value.toLowerCase())
  )
)
const handleEdit = (index: number, row: any) =>
{
  console.log(index, row)
}
const handleLocation = (index: number, row: any) =>
{
  eveBus.emit('graph-location', row)
}
function checkData()
{
  checkName.value = 'check'
  if (pageFooterH.value === minHeight)
    pageFooterH.value = 500
  activeTab.value = 'log'
  let index = 0
  let timer = setInterval(async() =>
  {
    index++
    outInfo.value.push({ time: new Date().toLocaleString(), describe: '检验测试，定时器执行' + index, type: ['SUCCESS', 'WARNING', 'ERROR'][index % 3] })
    if (index === 20)
    {
      checkPass.value = true
      activeTab.value = 'output'
      clearInterval(timer)
    }
    if (loginfo.value)
    {
      await nextTick()
      loginfo.value.scrollTop = loginfo.value.scrollHeight
    }
  }, 100)
}

function startResizing(event: MouseEvent)
{
  isResizing = true
  startY = event.clientY
  startHeight = pageFooterH.value
  document.addEventListener('mousemove', resizeAside)
  document.addEventListener('mouseup', stopResizing)
}
 
function resizeAside(event: MouseEvent)
{
  if (isResizing)
  {
    const newHeight = startHeight - (event.clientY - startY)
    pageFooterH.value = newHeight > minHeight ? newHeight : minHeight // 设置最小宽度为 50px
  }
}

function stopResizing()
{
  isResizing = false
  document.removeEventListener('mousemove', resizeAside)
  document.removeEventListener('mouseup', stopResizing)
}

function runPlug(routerName: string)
{
  checkName.value = routerName
  router.push('/'+routerName)
}

function closeConSole()
{
  pageFooterH.value = minHeight
}

function saveChange(event: KeyboardEvent)
{
  if (event.ctrlKey && event.key.toLowerCase() === 's')
  {
    event.preventDefault()
    // 在这里执行你想要的操作
    store.dispatch('variable/update')
    store.dispatch('savePage/update')
    store.commit('changeNeedSave', false)
  }
}
function initTable(prjid = 0)
{
  Promise.all([
    query({tabname:'flds', exp:`tabname = 'project_nodes'`}),
    query({tabname:'project_nodes', exp:`prjid = ${prjid}`})
  ]).then(ret =>
  {
    flds.value = ret[0].data
    tableData.value = ret[1].data
  }).catch(err=>console.log(err))
}
onMounted(async() =>
{
  router.push('/design')
  const db = await initDB()
  const data = await getCacheData()
  setDataInDB(db, data)
  document.addEventListener('mouseup', stopResizing)
  document.addEventListener('keydown', saveChange)
})
</script>
