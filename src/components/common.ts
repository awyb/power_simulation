export default class common
{
  constructor(private opts={})
  {
    
  }

  static getPorts()
  {
    return
  }

  static toolsConfig()
  {
    return {
      boundary:
      {
        name:'boundary'
      },
      segments:
      {
        name: 'segments',
        args: {
          snapRadius: 30,
          threshold: 50,
          attrs: {
            width: 30,
            height:10,
            x: -15,
            y: -5,
            rx: 5,
            ry: 5,
            fill: '#fff',
            stroke: '#000',
            'stroke-width': 2,
          }
        }
      },
      vertices:
      {
        name: 'vertices',
        args: {
          snapRadius:30,
          attrs: {
            stroke: '#000',
            fill: '#fff',
            strokeWidth:4,
          },
          stopPropagation:false
        }
      }
    }
  }

  static getNodes()
  {
    const nodes = []
    const groups = common.getGrounps()
    interface graphNode
    {
      x: number,
      y: number,
      width: number,
      height: number,
      angle: number,
      namec: string,
      tools: Array<[]>,
      attrs: object,
      ports: object
    }
    // nodes.push({
    //   x: 200,
    //   y: 300,
    //   width: 200,
    //   height: 40,
    //   angle:90,
    //   label: '结点1',
    //   tools: [
    //     {
    //       name: 'node-editor',
    //       args: {
    //         attrs: {
    //           backgroundColor: '#EFF4FF',
    //         },
    //       },
    //     },
    //   ],

    //   attrs:
    //   {
    //     body: {
    //       fill: '#f5f5f5',
    //       stroke: '#d9d9d9'
    //     },
    //   },
    //   ports:
    //   {
    //     groups: groups,
    //     items:
    //     [
    //       {
    //         id: 'out1_1',
    //         group: 'out',
    //         args:
    //         {
    //           x: 30,
    //           y: 0,
    //         },
    //         attrs:
    //         {
    //           text: { text: 'out1_1' },
    //         }
    //       },
    //       {
    //         id: 'out1_2',
    //         group: 'out',
    //         args:
    //         {
    //           x: 70,
    //           y: 0,
    //         },
    //         attrs:
    //         {
    //           text: { text: 'out1_2' },
    //         }
    //       },
    //       {
    //         id: 'in1_1',
    //         group: 'in',
    //         args:
    //         {
    //           x: 0,
    //           y: 10,
    //         },
    //         attrs:
    //         {
    //           text: { text: 'in1_1' },
    //         }
    //       },
    //       {
    //         id: 'in1_2',
    //         group: 'in',
    //         args:
    //         {
    //           x: 0,
    //           y: 30,
    //         },
    //         attrs:
    //         {
    //           text: { text: 'in1_2' },
    //         }
    //       }
    //     ]
    //   }
    // })
    nodes.push({
      x: 400,
      y: 200,
      width: 200,
      height: 200,
      shape: 'image',
      namec: '异步电机',
      attrs: {
        body: {
          fill: '#f5f5f5',
          stroke: '#d9d9d9',
        },
        image: {
          'xlink:href': '/static/svg/异步电机.svg',
          width: 200,
          height: 200,
        },
      },
      ports:
      {
        groups: groups,
        items:
        [
          {
            id: 'in2_1',
            group: 'in',
            args:
            {
              x: 0.068,
              y: 0.233,
            },
          },
          {
            id: 'in2_2',
            group: 'in',
            args:
            {
              x: 0.068,
              y: 0.513,
            }
          },
          {
            id: 'in2_3',
            group: 'in',
            args:
            {
              x: 0.068,
              y: 0.793,
            }
          },
          {
            id: 'out3_1',
            group: 'out',
            args:
            {
              x: 0.93,
              y: 0.513,
            }
          },
        ]
      }
    })
    nodes.push({
      x: 400,
      y: 400,
      width: 200,
      height: 200,
      shape: 'image',
      namec: '同步电机',
      attrs: {
        body: {
          fill: '#f5f5f5',
          stroke: '#d9d9d9',
        },
        image: {
          'xlink:href': '/static/svg/同步电机.svg',
          width: 200,
          height: 200,
        },
      },
      ports:
      {
        groups: groups,
        items:
        [
          {
            id: 'in3_1',
            group: 'in',
            args:
            {
              x: 0.03,
              y: 0.19,
            },
          },
          {
            id: 'in3_2',
            group: 'in',
            args:
            {
              x: 0.03,
              y: 0.81,
            }
          },
          {
            id: 'in3_3',
            group: 'in',
            args:
            {
              x: 0.36,
              y: 0.03,
            }
          },
          {
            id: 'out3_1',
            group: 'out',
            args:
            {
              x: 0.67,
              y: 0.03,
            }
          },
          {
            id: 'out3_2',
            group: 'out',
            args:
            {
              x: 0.96,
              y: 0.5,
            }
          }
        ]
      }
    })
    nodes.push({
      x: 200,
      y: 200,
      width: 200,
      height: 200,
      shape: 'image',
      namec: '异步逻辑',
      attrs: {
        body: {
          fill: '#f5f5f5',
          stroke: '#d9d9d9',
        },
        image: {
          'xlink:href': '/static/svg/异步逻辑.png',
          width: 200,
          height: 200,
        },
      },
      ports:
      {
        groups: groups,
        items:
        [
          {
            id: 'in4_1',
            group: 'in',
            args:
            {
              x: 0.04,
              y: 0.5,
            },
          },
          {
            id: 'out4_1',
            group: 'out',
            args:
            {
              x: 0.97,
              y: 0.5,
            }
          }
        ]
      }
    })
    return nodes
  }
  
  static getGrounps()
  {
    const groups =
    {
      out:
      {
        attrs:
        {
          circle:
          {
            r: 5,
            magnet: true,
            stroke: '#000000',
            strokeWidth: 1,
            fill: '#fff',
            visibility: 'hidden', // 初始时隐藏连接桩
          },
          text:
          {
            fontSize: 10,
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
        attrs:
        {
          circle:
          {
            r: 5,
            magnet: true,
            stroke: '#fff',
            strokeWidth: 1,
            fill: '#095aba',
            visibility: 'hidden', // 初始时隐藏连接桩
          },
          text:
          {
            fontSize: 10,
            fill: '#888',
          },
        },
        position:
        {
          name: 'absolute',
        },
        label: {
          position: 'left', // 标签位置
        }
      }
    }
    return groups
  }
}