<style scoped lang="less">
  .container { position: relative;
    .tool-bar { height: 40px; width: 100%;line-height: 40px;}
    .chart-container { box-shadow: 0px 0px 5px 0px #adadad;}
  }
</style>

<template>
  <div class="container" >
    <div class="tool-bar">
      <el-button @click="onRefresh" size="small">重置</el-button>
      <el-button @click="onPause" size="small">暂停</el-button>
      <el-button @click="onStart" size="small">开始</el-button>
    </div>
    <div class="chart-container" ref="chartRef" :style="{height: height + 'px', width: width + 'px'}"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, onBeforeUnmount, defineProps } from 'vue'
import * as echarts from 'echarts'
const chartRef = ref(null)
const props = defineProps({
  func: {
    type: Array,
    default:()=>(['sinBase'])
  },
  height: {
    type: Number,
    default: 500
  },
  width: {
    type: Number,
    default: 800
  }
})
const datas:{ [key: string]: any} = {

}
let chart: echarts.ECharts
let timer: number | undefined
let index = 0
let datalen = 0
const funcs = {
  logBase,
  expBase,
  cosBase,
  sinBase,
  inverseBase
}
props.func.forEach((f, index) =>
{
  datas['data'+(index+1)] = []
})
function onRefresh()
{
  Object.keys(datas).forEach(d =>
  {
    datas[d] = []
  })
  index = 0
  initChart()
}
function onPause()
{
  clearInterval(timer)
}
function onStart()
{
  initChart()
}
const seriesInit = (index: number, data: any) =>
{
  return {
    name: '曲线' + index,
    type: 'line', // 折线图
    data,
    animation: false, // 禁用动画
    smooth: true,
    yAxisIndex: 0,
    showSymbol: false,
  }
}
const option = {
  legend: {
    textStyle: {
      fontSize: 12,
      color: '#000'
    },
    left: '4%',
    top: '4%'
  },
  grid: {
    top: '16%',
    left: '4%',
    right: '4%',
    bottom: '4%',
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#283b56',
      },
    },
  },
  toolbox: {
    feature: {
      dataZoom: {
        yAxisIndex: 'none',
      },
      // restore: {},
      saveAsImage: {},
    },
  },
  xAxis: {
    axisLabel: {
      interval: Math.ceil(datalen / 6) - 1, // 设置x轴标签的间隔
    },
    type: 'category', // x轴类型设置为时间轴
    boundaryGap: true, // 时间轴不留白
    min: 0, // 设置x轴的最小值
    max: 'dataMax', // x轴最大值根据数据动态调整
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false
    },
    // X轴 竖线坐标指示线
    splitLine: {
      show: true
    }
  },
  yAxis:
  {
    type: 'value', // y轴类型设置为数值轴
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false
    },
    // X轴 竖线坐标指示线
    splitLine: {
      show: true
    }
  },
  series:Object.keys(datas).map((key, index)=>(seriesInit(index+1, datas[key])))
}
function initChart()
{
  // 更新数据的定时器，每秒增加一个新数据，删除一个最老的数据
  timer = setInterval(function()
  {
    Object.keys(datas).forEach((d, _index) =>
    {
      const num = funcs[props.func[_index] as keyof typeof funcs](index)
      datas[d].push([index, Number(num.toFixed(5))])
    })

    // 更新图表，设置切换动画效果
    chart.setOption({
      xAxis: {
        axisLabel: {
          interval: Math.ceil(datalen / 6) - 1, // 设置x轴标签的间隔
        },
      },
      series: Object.keys(datas).map(d=>({data:datas[d]}))
    })
    datalen ++
    index = parseFloat(add(0.005, index).toFixed(3))
    if (index > 3)
      clearInterval(timer) // 停止定时器
  }, 5) // 定时器
  // 使用配置项展示图表
  chart.setOption(option)
}
function logBase(x: number, base = Math.E)
{
  return Math.log(x + 1) / Math.log(base)
}
function expBase(x: number, base = 2 )
{
  return Math.pow(base, x)
}
function cosBase(x: number, base =2 )
{
  return base*Math.cos(x * base * Math.PI) + 2
}
function sinBase(x: number, base = Math.E)
{
  return base * Math.sin((x + 1) * 50)
}
function inverseBase(x: number, base = 2)
{
  return base / (x + 0.5)
}
function parabolaBase(x: number, a = 0, b = 0, c = 0)
{
  return a * (x * x) + b * x + c
}
function multiple(num1: number, num2: number)
{
  const factor = Math.pow(10, Math.max(num1.toString().length - num1.toString().indexOf('.') - 1, num2.toString().length - num2.toString().indexOf('.') - 1))
  const result = (num1 * factor) * (num2 * factor) / (factor * factor)
  return result
}
function add(num1:number, num2:number)
{
  let a = num1.toString().split('.').length===2?num1.toString().split('.')[1].length:1
  let b = num2.toString().split('.').length===2?num2.toString().split('.')[1].length:1
  var baseNum = Math.pow(10, Math.max(a, b))
  return (multiple(num1, baseNum) + multiple(num2, baseNum)) / baseNum
}

onMounted(() =>
{
  chart = echarts.init(chartRef.value)
  initChart()
})
onBeforeUnmount(() =>
{
  clearInterval(timer) // 清除定时器
  // 销毁图表实例
  chart.dispose()
})
</script>