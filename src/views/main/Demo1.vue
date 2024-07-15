<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div class="container" ref="container" />
</template>

<script lang="ts">
import { Graph } from '@antv/x6'
import { defineComponent, onMounted, ref } from 'vue'
export default defineComponent({
  name: 'Demo1',
  setup()
  {
    const container = ref<HTMLElement | null>(null)
    const renderGraph = () =>
    {
      if (!container.value) return
      const graph: Graph = new Graph({
        container: container.value,
        grid: true,
      })

      const source = graph.addNode({
        x: 120,
        y: 40,
        width: 100,
        height: 40,
        label: '结点1',
        attrs: {
          body: {
            fill: '#f5f5f5',
            stroke: '#d9d9d9',
          },
        },
        ports:
        {
          groups:
          {
            group1:
            {
              attrs:
              {
                circle:
                {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                },
                text:
                {
                  fontSize: 12,
                  fill: '#888',
                },
              },
              position:
              {
                name: 'absolute',
              },
              label: {
                position: 'top', // 标签位置
              }
            },
          },
          items:
          [
            {
              id: 'port1',
              group: 'group1',
              args:
              {
                x: 50,
                y: 0,
              },
              attrs:
              {
                text: { text: 'out' },
              }
            }
          ]
        }
      })

      const target = graph.addNode({
        x: 400,
        y: 260,
        width: 100,
        height: 40,
        label: '结点2',
        attrs: {
          body: {
            fill: '#f5f5f5',
            stroke: '#d9d9d9',
          },
        },
      })

      graph.addEdge({
        source,
        target,
        attrs: {
          line: {
            stroke: '#722ed1',
          },
        },
        router: {
          name: 'orth',
        },
        tools: {
          name: 'segments',
          args: {
            snapRadius: 20,
            attrs: {
              fill: '#444',
            },
          },
        },
      })
    }
    onMounted(() =>
    {
      renderGraph()
    })
    return {
      container,
    }
  }
})

</script>