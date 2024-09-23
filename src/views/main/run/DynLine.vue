<style scoped lang="less">
  .container {  height: 100%;width: 100%;
    .tool-bar { height: 50px; width: 100%;line-height: 50px;}
    .chart-container { box-shadow: 0px 0px 5px 0px #adadad;height:calc(100% - 50px);width: 100%;}
  }
</style>

<template>
  <div class="container">
    <div class="tool-bar">
      <el-button @click="onRefresh">重置</el-button>
      <el-button @click="onPause">暂停</el-button>
      <el-button @click="onStart">开始</el-button>
    </div>
    <div class="chart-container" ref="chartRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
const chartRef = ref(null)
let chart: echarts.ECharts
let timer: number | undefined
let data1: any = []
let data2: any = []
let data3: any = []
let index = 0
function onRefresh()
{
  data1 = []
  data2 = []
  data3 = []
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
const option = {
  legend: {
    textStyle: {
      fontSize: 12,
      color: '#000'
    },
    right: '4%',
    top: '4%'
  },
  grid: {
    top: '10%',
    left: '4%',
    right: '4%',
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
  xAxis: {

    axisLabel: {
      interval: Math.ceil(data1.length/6)-1, // 设置x轴标签的间隔
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
  series: [
    {
      name: '曲线1',
      type: 'line', // 折线图
      data: data1,
      animation: false, // 禁用动画
      smooth: true,
      yAxisIndex: 0,
      showSymbol: false,
    },
    {
      name: '曲线2',
      type: 'line', // 折线图
      data: data2,
      animation: false, // 禁用动画
      smooth: true,
      yAxisIndex: 0,
      showSymbol: false,
    },
    {
      name: '曲线3',
      type: 'line', // 折线图
      data: data3,
      animation: false, // 禁用动画
      smooth: true,
      yAxisIndex: 0,
      showSymbol: false,
    }
  ]
}
function initChart()
{
  // 更新数据的定时器，每秒增加一个新数据，删除一个最老的数据
  timer = setInterval(function()
  {
    data1.push([index, Number(sinBase(index, Math.E).toFixed(5))])
    // data2.push([index, Number(expBase(index, 2).toFixed(5))])
    data2.push([index, Number(parabolaBase(index, 1, 2, -1).toFixed(5))])
    data3.push([index, Number(cosBase(index, 2).toFixed(5))])
    
    // 更新图表，设置切换动画效果
    chart.setOption({
      xAxis: {
        axisLabel: {
          interval: Math.ceil(data1.length / 6) - 1, // 设置x轴标签的间隔
        },
      },
      series: [
        {
          data: data1,
        },
        {
          data: data2,
        },
        {
          data: data3,
        }
      ]
    })
    index = parseFloat(add(0.01, index).toFixed(2))
    if (index > 3)
      clearInterval(timer) // 停止定时器
  }, 10) // 定时器每秒执行一次
  // 使用配置项展示图表
  chart.setOption(option)
}
function logBase(x: number, base: number)
{
  return Math.log(x + 1) / Math.log(base)
}
function expBase(x: number, base: number)
{
  return Math.pow(base, x)
}
function cosBase(x: number, base: number)
{
  return base*Math.cos(x * base * Math.PI) + 2
}
function sinBase(x: number, base: number)
{
  return base*Math.sin(x * base * Math.PI)
}
function multiple(num1: number, num2: number)
{
  const factor = Math.pow(10, Math.max(num1.toString().length - num1.toString().indexOf('.') - 1, num2.toString().length - num2.toString().indexOf('.') - 1))
  const result = (num1 * factor) * (num2 * factor) / (factor * factor)
  return result
}
function parabolaBase(x: number, a = 0, b = 0, c = 0)
{
  return a * (x * x) + b * x + c
}
function add(num1:number, num2:number)
{
  let a = num1.toString().split('.').length===2?num1.toString().split('.')[1].length:1
  let b = num2.toString().split('.').length===2?num2.toString().split('.')[1].length:1
  var baseNum = Math.pow(10, Math.max(a, b))
  return (multiple(num1, baseNum) + multiple(num2, baseNum)) / baseNum
}
function multiple1(num1: number, num2: number)
{
  let m=0, s1=num1.toString(), s2=num2.toString()
  try
  {
    m+=s1.split('.')[1].length
  }
  catch (e)
  {}
  try
  {
    m+=s2.split('.')[1].length
  }
  catch (e)
  {}
  return Number(s1.replace('.', ''))*Number(s2.replace('.', ''))/Math.pow(10, m)
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