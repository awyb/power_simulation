<style scoped lang="less">
  .container { width: 100%;height: 100%;}
</style>

<template>
  <div class="container" ref="container" />
</template>

<script lang="ts">
import { Graph, Shape} from '@antv/x6'
// import { Stencil } from '@antv/x6-plugin-stencil'
import { Transform } from '@antv/x6-plugin-transform'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { History } from '@antv/x6-plugin-history'
import { defineComponent, onMounted, ref, onBeforeUnmount} from 'vue'

export default defineComponent({
  name: 'Demo1',
  setup()
  {
    let graph: Graph
    const container = ref<HTMLElement | null>(null)
    const handleKeydown = (event: KeyboardEvent) =>
    {
      if (event.ctrlKey && event.key === 'z')
      {
        event.preventDefault()
        graph.undo()
      }
      else if (event.ctrlKey && event.key === 'y')
      {
        event.preventDefault()
        graph.redo()
      }
    }
    const bindKey = ()=>
    {
      // #region 快捷键与事件
      graph.bindKey(['meta+c', 'ctrl+c'], () =>
      {
        const cells = graph.getSelectedCells()
        if (cells.length)
        
          graph.copy(cells)
        
        return false
      })
      graph.bindKey(['meta+x', 'ctrl+x'], () =>
      {
        const cells = graph.getSelectedCells()
        if (cells.length)
        
          graph.cut(cells)
        
        return false
      })
      graph.bindKey(['meta+v', 'ctrl+v'], () =>
      {
        if (!graph.isClipboardEmpty())
        {
          const cells = graph.paste({ offset: 32 })
          graph.cleanSelection()
          graph.select(cells)
        }
        return false
      })
    }
    const addNode = ()=>
    {
      const groups =
      {
        out:
        {
          attrs:
          {
            circle:
            {
              r: 4,
              magnet: true,
              stroke: '#000000',
              strokeWidth: 1,
              fill: '#fff',
              visibility: 'hidden', // 初始时隐藏连接桩
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
        in:
        {
          markup: [
            {
              tagName: 'rect',
              selector: 'rect',
            }
          ],
          attrs:
          {
            rect:
            {
              magnet: true,
              stroke: '#000000',
              strokeWidth: 1,
              fill: '#fff',
              width: 8,
              height: 8,
              x: -4,
              y: -4,
              visibility: 'hidden', // 初始时隐藏连接桩
            },
            text:
            {
              fontSize: 12,
              fill: '#888',
            },
          },
          position:
          {
            name: 'bottom',
          },
          label: {
            position: 'bottom', // 标签位置
          }
        },
      }
      const source = graph.addNode({
        x: 120,
        y: 40,
        width: 100,
        height: 40,
        label: '结点1',
        tools: [
          {
            name: 'node-editor',
            args: {
              attrs: {
                backgroundColor: '#EFF4FF',
              },
            },
          },
        ],

        attrs:
        {
          body: {
            fill: '#f5f5f5',
            stroke: '#d9d9d9'
          },
        },
        ports:
        {
          groups: groups,
          items:
          [
            {
              id: 'out1',
              group: 'out',
              args:
              {
                x: 30,
                y: 0,
              },
              attrs:
              {
                text: { text: 'out1' },
              }
            },
            {
              id: 'out2',
              group: 'out',
              args:
              {
                x: 70,
                y: 0,
              },
              attrs:
              {
                text: { text: 'out1' },
              }
            },
            {
              id: 'in1',
              group: 'in',
              args:
              {
                x: 45,
                y: 0,
              },
              attrs:
              {
                text: { text: 'in1' },
              }
            },
            {
              id: 'in2',
              group: 'in',
              args:
              {
                x: 55,
                y: 0,
              },
              attrs:
              {
                text: { text: 'in2' },
              }
            }
          ]
        }
      })

      const target = graph.addNode({
        x: 400,
        y: 260,
        width: 150,
        height: 150,
        shape: 'image',
        attrs: {
          body: {
            fill: '#f5f5f5',
            stroke: '#d9d9d9',
          },
          image: {
            'xlink:href': '/static/svg/异步电机.svg',
            width: 150,
            height: 150,
          },
        },
        ports:
        {
          groups: groups,
          items:
          [
            {
              id: 'in1',
              group: 'in',
              args:
              {
                x: 45,
                y: 0,
              },
              attrs:
              {
                text: { text: 'in1' },
              }
            },
            {
              id: 'in2',
              group: 'in',
              args:
              {
                x: 55,
                y: 0,
              },
              attrs:
              {
                text: { text: 'in2' },
              }
            }
          ]
        }
      })
      
      // graph.addEdge({
      //   source,
      //   target,
      //   router: {
      //     name: 'manhattan',
      //     args: {
      //       startDirections: ['bottom'],
      //       endDirections: ['top'],
      //     },
      //   },
      //   attrs: {
      //     line: {
      //       stroke: '#722ed1',
      //     },
      //   },
      // })
      // graph.addEdge({
      //   source,
      //   target,
      //   attrs: {
      //     line: {
      //       stroke: '#722ed1',
      //     },
      //   },
      //   router: {
      //     name: 'orth',
      //   },
      //   tools: {
      //     name: 'segments',
      //     args: {
      //       snapRadius: 20,
      //       attrs: {
      //         fill: '#444',
      //       },
      //     },
      //   },
      // })
    }
    const renderGraph = () =>
    {
      if (!container.value) return
      graph = new Graph({
        container: container.value,
        grid: true,
        connecting: {
          // // 设置连接点
          // allowBlank: false,  // 不允许连接到空白处
          // allowMulti: 'withPort',  // 允许多个连接到同一个节点，但不同的端口
          // allowLoop: false,  // 不允许连接回自身
          // highlight: true,  // 在拖动连接时高亮显示连接点
          // // connector: 'smooth',  // 设置连接器的样式
          // connectionPoint: 'anchor',  // 设置连接点样式
          // anchor: 'center',  // 设置锚点在中心
          // createEdge()
          // {
          //   return new Shape.Edge({
          //     attrs: {
          //       line: {
          //         stroke: '#722ed1',
          //       },
          //     },
          //     router: {
          //       name: 'manhattan',
          //       args: {
          //         startDirections: ['bottom'],
          //         endDirections: ['top'],
          //       },
          //     },
          //   })
          // },
          router: {
            name: 'manhattan',
            args: {
              startDirections: ['bottom'],
              endDirections: ['top'],
            },
          },
          validateConnection({ sourceView, targetView, sourceMagnet, targetMagnet })
          {
            // 自定义连接验证逻辑
            if (targetMagnet&&sourceMagnet && targetMagnet.getAttribute('port-group') === 'in'&& sourceMagnet.getAttribute('port-group') === 'out')
              return true  // 仅允许连接到输入端口
            return false  // 否则不允许连接
          },
        },
      })
      
      // #region 使用插件
      graph
        .use(
          new Transform({
            resizing: true,
            rotating: true,
          }),
        )
        .use(
          new Selection({
            rubberband: true,
            showNodeSelectionBox: true,
          }),
        )
        .use(new Snapline())
        .use(new Keyboard())
        .use(new Clipboard())
        .use( new History({
          enabled: true,
        }))
     
      bindKey()
      addNode()
      // 链接桩的显示与隐藏，主要是照顾菱形
      const changePortsShow= (val: boolean) =>
      {
        if (!container.value) return
        const ports = container.value.querySelectorAll('.x6-port-body')
        for (let i = 0, len = ports.length; i < len; i = i + 1)
          (ports[i] as HTMLElement).style.visibility = val ? 'visible' : 'hidden'
        
        const labels = container.value.querySelectorAll('.x6-port-label')
        for (let i = 0, len = labels.length; i < len; i = i + 1)
          (ports[i] as HTMLElement).style.visibility = val ? 'visible' : 'hidden'
        
      }
      // 控制连接桩显示/隐藏
      graph.on('node:mouseenter', () =>
      {
        changePortsShow(true)
      })
      graph.on('node:mouseleave', () =>
      {
        // if (this.isPortsShow) return
        changePortsShow(false)
      })

      // 监听键盘事件
      document.addEventListener('keydown', handleKeydown)
    }
    onBeforeUnmount(() =>
    {
      // 移除键盘事件监听器
      document.removeEventListener('keydown', handleKeydown)
    })
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