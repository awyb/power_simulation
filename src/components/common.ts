import { rect } from '@antv/x6/lib/registry/connection-point/rect'
import { stroke } from '@antv/x6/lib/registry/highlighter/stroke'

export default class common
{
  constructor(private opts={})
  {
    
  }

  static getFlds()
  {

    const _fld = [
      {name:'Name', label:'名称', unit:'', disptype:1},
      {name:'Rated Frequency', label:'额定频率', unit:'Hz', disptype:1},
      {name:'Rated Voltage (L-L, RMS)', label:'额定电压', unit:'kV', disptype:1},
      {name:'Input Capacity', label:'输入容量', unit:'MVar', disptype:1},
      {name:'Rated Active Power (3 Phase)', label:'额定有功功率', unit:'MW', disptype:1},
      {name:'Rated Reactive Power (3 Phase)', label:'额定无功功率', unit:'MVar', disptype:1},
      {name:'Voltage Index for P', label:'电压系数', unit:'', disptype:1},
      {name:'Voltage Index for Q', label:'电压系数', unit:'', disptype:1},
      {name:'Freq Index for P', label:'频率系数', unit:'', disptype:1},
      {name:'Freq Index for Q', label:'频率系数', unit:'', disptype:1},
      {name:'Initial Voltage', label:'初始电压', unit:'p.u.', disptype:1},
      {name:'Steady-state Frequency', label:'额定频率', unit:'Hz', disptype:1},
      {name:'Length of Line', label:'线路长度', unit:'km', disptype:1},
      {name:'Parameter Format', label:'参数输入方式', unit:'', disptype:2},
      {name:'0 Seq. Data', label:'零序参数输入方法', unit:'', disptype:2},
      {name:'Has the Data Been Corrected for Long Line Effects?', label:'填入的线路参数是否已进行过长导线修正?', unit:'', disptype:2},
      {name:'Model Type', label:'传输线模型种类', unit:'', disptype:2},
      {name:'Set This Line as a Network Partition Line?', label:'是否设置成网络分区线', unit:'', disptype:2},
      {name:'Set This Line as a Multi-machine Network Partition Line?', label:'是否设置成多台机器网络分区线', unit:'', disptype:2},
      {name:'Is Star Point Grounded?', label:'是否为星点接地', unit:'', disptype:2},
      {name:'Rated Voltage (L-L, RMS)', label:'额定电压', unit:'kV', disptype:1},
      {name:'Function Type', label:'函数类型', unit:'', disptype:2},
      {name:'Frequency', label:'频率', unit:'Hz', disptype:1},
      {name:'Start-up Type', label:'启动类型', unit:'', disptype:2},
      {name:'阻抗输入方式', label:'阻抗输入方式', unit:'', disptype:2},
      {name:'Ramping Time', label:'斜坡启动时间(仅初始化用)', unit:'s', disptype:1},
      {name:'Voltage Angle', label:'母线电压相位', unit:'Deg', disptype:1},
      {name:'Voltage Magnitude (L-L, RMS)', label:'母线电压幅值', unit:'p.u.', disptype:1},
      {name:'Base Voltage (L-L, RMS)', label:'母线电压基值', unit:'kV', disptype:1},
      {name:'Initial Phase', label:'初始相位', unit:'Deg', disptype:1},
      {name:'Frequency', label:'频率', unit:'Hz', disptype:1},
      {name:'Resistance', label:'内阻', unit:'Ω', disptype:1},
      {name:'Voltage Ramp Up Time', label:'启动时间', unit:'s', disptype:1},
      {name:'Voltage Input Time Constant', label:'启动时间常数', unit:'s', disptype:1},

    ]
    return _fld
  }

  static getFldValues()
  {
    const _fldvalue = [
      { colname:'Parameter Format', dbvalue:1, disp:'R, X, B (p.u.)', dispc:'标幺值' },
      { colname:'Parameter Format', dbvalue:2, disp:'R, Xl, Xc (Ω)', dispc:'有名值' },
      { colname:'0 Seq. Data', dbvalue:1, disp:'Same as + Seq. Data', dispc:'同正序数据' },
      { colname:'0 Seq. Data', dbvalue:2, disp:'Enter 0 Seq. Data', dispc:'输入零序数据' },
      { colname:'Has the Data Been Corrected for Long Line Effects?', dbvalue:1, disp:'NO', dispc:'否' },
      { colname:'Has the Data Been Corrected for Long Line Effects?', dbvalue:2, disp:'YES', dispc:'是' },
      { colname:'Model Type', dbvalue:1, disp:'Lumped π-Model', dispc:'零序模型' },
      { colname:'Model Type', dbvalue:2, disp:'Bergeron Line Model', dispc:'Bergeron模型' },
      { colname:'Set This Line as a Network Partition Line?', dbvalue:1, disp:'NO', dispc:'否' },
      { colname:'Set This Line as a Network Partition Line?', dbvalue:2, disp:'YES', dispc:'是' },
      { colname:'Set This Line as a Multi-machine Network Partition Line?', dbvalue:1, disp:'NO', dispc:'否' },
      { colname:'Set This Line as a Multi-machine Network Partition Line?', dbvalue:2, disp:'YES', dispc:'是' },
      { colname:'Is Star Point Grounded?', dbvalue:1, disp:'NO', dispc:'否' },
      { colname:'Is Star Point Grounded?', dbvalue:2, disp:'YES', dispc:'是' },
      { colname:'Function Type', dbvalue:1, disp:'PQ', dispc:'PQ' },
      { colname:'Function Type', dbvalue:2, disp:'PV', dispc:'PV' },
      { colname:'Start-up Type', dbvalue:1, disp:'Linear', dispc:'线性' },
      { colname:'Start-up Type', dbvalue:2, disp:'Real Pole Ramp', dispc:'实际极点斜坡' },
      { colname:'阻抗输入方式', dbvalue:1, disp:'填写等效电阻和电抗', dispc:'填写等效电阻和电抗' },
      { colname:'阻抗输入方式', dbvalue:2, disp:'填写等效阻抗的幅值和相角', dispc:'填写等效阻抗的幅值和相角' },
      { colname:'阻抗输入方式', dbvalue:3, disp:'填写短路电流', dispc:'填写短路电流' },
      
    ]
    return _fldvalue
  }
  static getPorts()
  {
    return
  }

  static toolsConfig()
  {
    return {
      'source-arrowhead':
      {
        name: 'source-arrowhead',
        args: {
          attrs: {
            fill: '#fff',
            stroke:'#000'
          },
        },
      },
      'target-arrowhead':
      {
        name: 'target-arrowhead',
        args: {
          attrs: {
            fill: '#fff',
            stroke:'#000'
          },
        },
      },
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

  static equidistributePors(start:{x:number, y:number}, end:{x:number, y:number}, distance:number)
  {
    const points = []
    const len = Math.sqrt((Math.pow(start.x-end.x, 2) + Math.pow(start.y-end.y, 2)))
    const sin = Math.abs(end.y - start.y) / len
    const cos = Math.abs(end.x - start.x) / len
    for (let i=0; i<len/distance; i++)
    {
      const x = start.x + i*distance*cos
      const y = start.y + i*distance*sin
      points.push({x, y})
    }
    return points
  }
  static getNodes()
  {
    const nodes = []
    const groups = common.getGrounps()
    nodes.push({
      x: 400,
      y: 160,
      width: 160,
      height: 160,
      shape: 'image',
      namec: '异步电机',
      attrs: {
        body: {
          fill: '#f5f5f5',
          stroke: '#d9d9d9',
        },
        image: {
          'xlink:href': '/static/image/nodeSvg/异步电机.svg',
          width: 160,
          height: 160,
        },
      },
      data:{
      },
      ports:
      {
        groups: groups,
        items:
        [
          {
            id: 'in1_1',
            group: 'in',
            args:
            {
              x: 0.09,
              y: 0.233,
            },
          },
          {
            id: 'in1_2',
            group: 'in',
            args:
            {
              x: 0.09,
              y: 0.513,
            }
          },
          {
            id: 'in1_3',
            group: 'in',
            args:
            {
              x: 0.09,
              y: 0.793,
            }
          },
          {
            id: 'out1_1',
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
      width: 160,
      height: 160,
      shape: 'image',
      namec: '同步电机',
      attrs: {
        body: {
          fill: '#f5f5f5',
          stroke: '#d9d9d9',
        },
        image: {
          'xlink:href': '/static/image/nodeSvg/同步电机.svg',
          width: 160,
          height: 160,
        },
      },
      data:{

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
              x: 0.03,
              y: 0.19,
            },
          },
          {
            id: 'in2_2',
            group: 'in',
            args:
            {
              x: 0.03,
              y: 0.81,
            }
          },
          {
            id: 'in2_3',
            group: 'in',
            args:
            {
              x: 0.36,
              y: 0.03,
            }
          },
          {
            id: 'out2_1',
            group: 'out',
            args:
            {
              x: 0.67,
              y: 0.03,
            }
          },
          {
            id: 'out2_2',
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
      x: 160,
      y: 160,
      width: 160,
      height: 160,
      shape: 'image',
      namec: '异步逻辑',
      attrs: {
        body: {
          fill: '#f5f5f5',
          stroke: '#d9d9d9',
        },
        image: {
          'xlink:href': '/static/image/nodeSvg/异步逻辑.png',
          width: 160,
          height: 160,
        }
      },
      data:{

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
              x: 0.04,
              y: 0.5,
            },
          },
          {
            id: 'out3_1',
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
    nodes.push({
      x: 400,
      y: 160,
      width: 160,
      height: 160,
      shape: 'image',
      namec: '并联电容/电抗器',
      attrs: {
        body: {
          fill: '#f5f5f5',
          stroke: '#d9d9d9',
        },
        image: {
          'xlink:href': '/static/image/nodeSvg/并联电容_电抗器.svg',
          width: 160,
          height: 160,
        },
      },
      data:{
        params:{
          Configuration:{
            'Name':'',
            'Rated Frequency':50,
            'Rated Voltage (L-L, RMS)':110,
            'Input Capacity':1
          }
        }
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
              x: 0.5,
              y: 0.2,
            },
          }
        ]
      }
    })
    nodes.push({
      x: 400,
      y: 160,
      width: 160,
      height: 160,
      shape: 'image',
      namec: '静态负载',
      attrs: {
        body: {
          fill: '#f5f5f5',
          stroke: '#d9d9d9',
        },
        image: {
          'xlink:href': '/static/image/nodeSvg/静态负载.svg',
          width: 160,
          height: 160,
        },
      },
      
      data:{
        params:{
          Configuration:{
            'Name':'',
            'Rated Voltage (L-L, RMS)':500,
            'Rated Frequency':50,
            'Rated Active Power (3 Phase)':50,
            'Rated Reactive Power (3 Phase)':20,
            'Voltage Index for P':2,
            'Voltage Index for Q':2,
            'Freq Index for P':0,
            'Freq Index for Q':0,
            'Initial Voltage':1
          }
        }
      },
      ports:
      {
        groups: groups,
        items:
        [
          {
            id: 'in5_1',
            group: 'in',
            args:
            {
              x: 0.5,
              y: 0.2,
            },
          }
        ]
      }
    })
    nodes.push({
      x: 400,
      y: 160,
      width: 160,
      height: 160,
      shape: 'image',
      namec: '三相传输线',
      attrs: {
        body: {
          fill: '#f5f5f5',
          stroke: '#d9d9d9',
        },
        image: {
          'xlink:href': '/static/image/nodeSvg/三相传输线.svg',
          width: 160,
          height: 160,
        },
      },
      
      data:{
        params:{
          Configuration:{
            'Name':'',
            'Steady-state Frequency':50,
            'Length of Line':1,
            'Parameter Format':1, // R, X, B (p.u.)|| R, Xl, Xc (Ω)
            '0 Seq. Data':2, // Same as + Seq. Data||Enter 0 Seq. Data
            'Has the Data Been Corrected for Long Line Effects?':1, // NO||YES
            'Model Type':2, // Lumped π-Model||Bergeron Line Model
            'Set This Line as a Network Partition Line?':1, // NO||YES
            'Set This Line as a Multi-machine Network Partition Line?':1 // NO||YES
          }
        }
      },
      ports:
      {
        groups: groups,
        items:
        [
          {
            id: 'in5_1',
            group: 'in',
            args:
            {
              x: 0.04,
              y: 0.5,
            },
          },
          {
            id: 'in5_2',
            group: 'in',
            args:
            {
              x: 0.96,
              y: 0.5,
            },
          }
        ]
      }
    })
    nodes.push({
      x: 400,
      y: 160,
      width: 160,
      height: 160,
      shape: 'image',
      namec: '三相戴维南等值电压源',
      attrs: {
        body: {
          fill: '#f5f5f5',
          stroke: '#d9d9d9',
        },
        image: {
          'xlink:href': '/static/image/nodeSvg/三相戴维南等值电压源.svg',
          width: 160,
          height: 160,
        },
      },
      
      data:{
        params:{
          Configuration:{
            'Name':'',
            'Is Star Point Grounded?':1, // NO||YES
            'Rated Voltage (L-L, RMS)':230,
            'Function Type':1, // Sine||Cosine
            'Frequency':50,
            'Start-up Type':1, // Linear Ramp||Real Pole Ramp
            '阻抗输入方式':1 // 填写等效电阻和电抗||填写等效阻抗的幅值和相角||填写短路电流
          }
        }
      },
      ports:
      {
        groups: groups,
        items:
        [
          {
            id: 'in6_1',
            group: 'in',
            args:
            {
              x: 0.96,
              y: 0.5,
            },
          }
        ]
      }
    })
    nodes.push({
      x: 400,
      y: 160,
      width: 160,
      height: 160,
      shape: 'image',
      namec: '三相交流母线',
      attrs: {
        body: {
          fill: '#f5f5f5',
          stroke: '#d9d9d9',
        },
        image: {
          'xlink:href': '/static/image/nodeSvg/三相交流母线.svg',
          width: 160,
          height: 160,
        },
      },
      
      data:{
        params:{
          Configuration:{
            'Name':'',
            'Rated Frequency':50,
            'Ramping Time':0.06,
            'Voltage Angle':0,
            'Voltage Magnitude (L-L, RMS)':1,
            'Base Voltage (L-L, RMS)':110,
          }
        }
      },
      ports:
      {
        groups: groups,
        
        items: this.equidistributePors({x:0.05, y:0.454}, {x:0.96, y:0.454}, 4/160).map((p, i)=>
        {
          return {
            id: 'in7_'+(i+1),
            group: 'inline',
            args:
            {
              ...p
            },
          }
        })
        
      }
    })
    nodes.push({
      x: 400,
      y: 160,
      width: 160,
      height: 160,
      zIndex:100,
      shape: 'image',
      namec: '三相交流电压源',
      attrs: {
        body: {
          fill: '#f5f5f5',
          stroke: '#d9d9d9',
        },
        image: {
          'xlink:href': '/static/image/nodeSvg/三相交流电压源.svg',
          width: 160,
          height: 160,
        },
      },
      
      data:{
        params:{
          Configuration:{
            'Source Name	':'',
            'Is Star Point Grounded?':2, // NO||YES
            'Rated Voltage (L-L, RMS)':230,
            'Function Type':1,
            'Initial Phase':0,
            'Frequency':60,
            'Resistance':0,
            'Start-up Type':1,
            'Voltage Ramp Up Time':0.05,
            'Voltage Input Time Constant':0.05
          }
        }
      },
      ports:
      {
        groups: groups,
        items:
        [
          {
            id: 'in7_1',
            group: 'in',
            args:
            {
              x: 0.96,
              y: 0.5,
            },
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
        markup: [
          {
            tagName: 'circle',
            selector: 'outcircle',
          },
          {
            tagName: 'circle',
            selector: 'circle',
          }
        ],
        attrs:
        {
          circle:
          {
            r: 5,
            magnet: true,
            stroke: '#fff',
            strokeWidth: 1,
            fill: '#000',
            visibility: 'hidden', // 初始时隐藏连接桩
          },
          outcircle: // 添加一个外部圆圈,更容易选中
          {
            r: 7,
            magnet: true,
            stroke: 'transparent',
            strokeWidth: 0.1,
            fill: 'transparent',
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
      inline:
      {
        // markup: [
        //   {
        //     tagName: 'rect',
        //     selector: 'rect',
        //   }
        // ],
        attrs:
        {
          // rect:
          // {
          //   width: 4,
          //   height: 6,
          //   x:-2,
          //   y:-2.8,
          //   magnet: true,
          //   stroke: 'transparent',
          //   strokeWidth:0.1,
          //   fill: 'transparent',
          // },
          circle:
          {
            r: 1.9,
            magnet: true,
            stroke: 'transparent',
            strokeWidth: 0.1,
            fill: 'transparent',
            // visibility: 'hidden', // 初始时隐藏连接桩
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
      },
      in:
      {
        markup: [
          {
            tagName: 'circle',
            selector: 'outcircle',
          },
          {
            tagName: 'circle',
            selector: 'circle',
          }
        ],
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
          outcircle: // 添加一个外部圆圈,更容易选中
          {
            r: 7,
            magnet: true,
            stroke: 'transparent',
            strokeWidth: 0.1,
            fill: 'transparent',
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