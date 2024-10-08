
import eveBus from '@/components/eveBus'

export default class common
{
  constructor(private opts={})
  {
    
  }
  static getGVars()
  {
    const global = [
      {name:'Rs', label:'', unit:'', disptype:1, default:'0.0001', isFunc:false},
      {name:'R2', label:'', unit:'', disptype:1, default:'0.228', isFunc:false},
    ]
    return global
  }
  static getGConfigFlds()
  {
    const flds = [
      {name:'bgcolor', value: null, unit:'', isValue:true, label:'背景颜色', disptype:6, expression:null,
        callback:(val:string)=>
        {
          eveBus.emit('change-graph-config', {color:val})
        }},
      {name:'gridtype', value:null, unit:'', isValue:true, label:'网格类型', disptype:2,
        fldValue:[
          {colname:'hidden', dbvalue:'hidden', disp:'hidden', dispc:'隐藏'},
          {colname:'point', dbvalue:'dot', disp:'dot', dispc:'点阵'},
          {colname:'nets', dbvalue:'mesh', disp:'mesh', dispc:'网状'},
          {colname:'dbnewts', dbvalue:'doubleMesh', disp:'doubleMesh', dispc:'双层网状'}
        ], expression:null,
        callback:(val:string)=>
        {
          eveBus.emit('change-graph-grid', {type:val})
        }},
      {name:'gridcolor', value: null, unit:'', isValue:true, label:'网格颜色', disptype:6, expression:null,
        callback:(val:string)=>
        {
          eveBus.emit('change-grid-color', {color:val})
        }
      },
      {name:'pagesplit', value:null, unit:'', isValue:true, label:'页面分割线', disptype:5, expression:null, callback:(val:boolean)=>
      {
        eveBus.emit('show-page-split', val)
      }},
      {name:'defdragpage', value: null, unit:'', isValue:true, label:'默认拖拽画布', disptype:5, expression:null, callback:(val:boolean)=>
      {
        eveBus.emit('drag-graph-page', val)
      }},
      {name:'celllabel', value: null, unit:'', isValue:true, label:'元件标签', disptype:5, expression:null, callback:(val:boolean)=>
      {
        eveBus.emit('show-cell-label', val)
      }},
      {name:'portlabel', value: null, unit:'', isValue:true, label:'引脚标签', disptype:5, expression:null, callback:(val:boolean)=>
      {
        eveBus.emit('show-port-label', val)
      }},
    ]
    return flds
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
      y: 400,
      width: 160,
      height: 160,
      shape: 'image',
      namec: '同步电机',
      label: '同步电机_1',
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
        type:2,
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
            attrs: {
              text: { text: 'in2_1' },
            },
          },
          {
            id: 'in2_2',
            group: 'in',
            args:
            {
              x: 0.03,
              y: 0.81,
            },
            attrs: {
              text: { text: 'in2_2' },
            },
          },
          {
            id: 'in2_3',
            group: 'in',
            args:
            {
              x: 0.36,
              y: 0.03,
            },
            attrs: {
              text: { text: 'in2_3' },
            },
          },
          {
            id: 'out2_1',
            group: 'out',
            args:
            {
              x: 0.67,
              y: 0.03,
            },
            attrs: {
              text: { text: 'out2_1' },
            },
          },
          {
            id: 'out2_2',
            group: 'out',
            args:
            {
              x: 0.96,
              y: 0.5,
            },
            attrs: {
              text: { text: 'out2_2' },
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
      namec: '并联电容/电抗器',
      label: '并联电容/电抗器_1',
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
        type:2,
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
              y: 0.05,
            },
            attrs: {
              text: { text: 'in4_1' },
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
      label: '静态负载_1',
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
        type:2,
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
            attrs: {
              text: { text: 'in5_1' },
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
      label: '三相传输线_1',
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
        type:2,
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
            id: 'in6_1',
            group: 'in',
            args:
            {
              x: 0.04,
              y: 0.5,
            },
            attrs: {
              text: { text: 'in6_1' },
            },
          },
          {
            id: 'in6_2',
            group: 'in',
            args:
            {
              x: 0.96,
              y: 0.5,
            },
            attrs: {
              text: { text: 'in6_2' },
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
      label: '三相戴维南等值电压源_1',
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
        type:2,
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
            id: 'in7_1',
            group: 'in',
            args:
            {
              x: 0.96,
              y: 0.5,
            },
            attrs: {
              text: { text: 'in7_1' },
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
      label: '三相交流母线_1',
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
        type:2,
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
            id: 'in8_'+(i+1),
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
      label: '三相交流电压源',
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
        type:2,
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
            id: 'in9_1',
            group: 'in',
            args:
            {
              x: 0.96,
              y: 0.5,
            },
            attrs: {
              text: { text: 'in9_1' },
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
      zIndex:100,
      shape: 'image',
      namec: '单相变压器',
      label: '单相变压器_1',
      attrs: {
        body: {
          fill: '#f5f5f5',
          stroke: '#d9d9d9',
        },
        image: {
          'xlink:href': '/static/image/nodeSvg/单相变压器.svg',
          width: 160,
          height: 160,
        },
        
      },
      
      data:{
        type:1,
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
            id: 'in10_1',
            group: 'in',
            args:
            {
              x: 0.96,
              y: 0.28,
            },
            attrs: {
              text: { text: 'in10_1' },
            },
          },
          {
            id: 'in10_2',
            group: 'in',
            args:
            {
              x: 0.96,
              y: 0.72,
            },
            attrs: {
              text: { text: 'in10_2' },
            },
          },
          {
            id: 'in10_3',
            group: 'in',
            args:
            {
              x: 0.04,
              y: 0.28,
            },
            attrs: {
              text: { text: 'in10_3' },
            },
          },
          {
            id: 'in10_4',
            group: 'in',
            args:
            {
              x: 0.04,
              y: 0.72,
            },
            attrs: {
              text: { text: 'in10_4'},
            },
          }
        ]
      }
    })
    nodes.forEach(node=>
    {
      Object.assign(node.attrs, {label:{
        refX: 0.5,
        refY: '100%',
        refY2: 4,
        textAnchor: 'middle',
        textVerticalAnchor: 'top',
        fontSize: 16,
        fontWeight: 'bold',
        display:'none'
      }})
      
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
            fontSize: 16,
            fill: '#888',
            display:'none',
          },
        },
        position:
        {
          name: 'absolute',
        },
        label: {
          position: 'outside', // 标签位置
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
            fontSize: 16,
            fill: '#888',
            display:'none',
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
            fontSize: 16,
            fill: '#888',
            display:'none',
          },
        },
        position:
        {
          name: 'absolute',
        },
        label: {
          position: 'outside', // 标签位置
        }
      }
    }
    return groups
  }
}