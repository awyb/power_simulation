
import eveBus from '@/components/ts/eveBus'
import { query } from '@/request'
import { fldsObject, collapseItem, nodeParams, dbvalueBase } from '@/components/interface/interfaceBase'
import { findStore } from '@/indexedDB'
import { createIndexedDB } from '@/views/main/init'
export default class common
{
  constructor(private opts={})
  {
    
  }
  static globalFunc()
  {
    const funcs = {
      'change-graph-config': (val: string) =>
      {
        eveBus.emit('change-graph-config', { color: val })
      },
      'change-graph-grid':(val: string) =>
      {
        eveBus.emit('change-graph-grid', { type: val })
      },
      'change-grid-color': (val: string) =>
      {
        eveBus.emit('change-grid-color', { color: val })
      },
      'show-page-split': (val: boolean) =>
      {
        eveBus.emit('show-page-split', val)
      },
      'drag-graph-page':(val: boolean) =>
      {
        eveBus.emit('drag-graph-page', val)
      },
      'show-cell-label': (val: boolean) =>
      {
        eveBus.emit('show-cell-label', val)
      },
      'show-port-label': (val: boolean) =>
      {
        eveBus.emit('show-port-label', val)
      }
    }
    return funcs
  }
  static getGConfigFlds()
  {
    const flds = [
      {
        name: 'bgcolor', value: '#fff', value_: '', defval:'', unit: '', isval: 1, namec: '背景颜色', disptype: 6, disabled: false, disporder: 1,
        ufunc: [
          {
            type: 'function',
            args: { name: 'change-graph-config' }
          }
        ]
      },
      {
        name: 'gridtype', value: 'doubleMesh', value_: '', defval: '', unit: '', isval: 1, namec: '网格类型', disptype: 2, disabled: false, disporder: 2,
        fldvalue:[
          { tabname:'gridtype', colname: 'hidden', dbvalue: 'hidden', disp: 'hidden', dispc: '隐藏', disporder: 1 },
          { tabname: 'gridtype', colname: 'point', dbvalue: 'dot', disp: 'dot', dispc: '点阵', disporder: 2 },
          { tabname: 'gridtype', colname: 'nets', dbvalue: 'mesh', disp: 'mesh', dispc: '网状', disporder: 3 },
          { tabname: 'gridtype', colname: 'dbnewts', dbvalue: 'doubleMesh', disp: 'doubleMesh', dispc: '双层网状', disporder: 4 }
        ],
        ufunc: [
          {
            type: 'function',
            args: { name: 'change-graph-grid' }
          }
        ]},
      {
        name: 'gridcolor', value: '#ddd', value_: '', defval: '', unit: '', isval: 1, namec: '网格颜色', disptype: 6, disabled: false, disporder: 3,
        ufunc: [
          {
            type: 'function',
            args: { name: 'change-grid-color' }
          }
        ]
      },
      {
        name: 'pagesplit', value: true, value_: '', defval: '', unit: '', isval: 1, namec: '页面分割线', disptype: 3, disabled: false, disporder: 4,
        ufunc: [
          {
            type: 'function',
            args: { name: 'show-page-split' }
          }
        ]},
      {
        name: 'defdragpage', value: false, value_: '', defval: '', unit: '', isval: 1, namec: '默认拖拽画布', disptype: 3, disabled: false, disporder: 5,
        ufunc: [
          {
            type: 'function',
            args: { name: 'drag-graph-page' }
          }
        ]},
      {
        name: 'celllabel', value: false, value_: '', defval: '', unit: '', isval: 1, namec: '元件标签', disptype: 3, disabled: false, disporder: 6,
        ufunc: [
          {
            type: 'function',
            args: { name: 'show-cell-label' }
          }
        ]},
      {
        name: 'portlabel', value: false, value_: '', defval: '', unit: '', isval: 1, namec: '引脚标签', disptype: 3, disabled: false, disporder: 7,
        ufunc: [
          {
            type: 'function',
            args: { name: 'show-port-label' }
          }
        ]},
    ]
    return flds
  }

  static getAttr()
  {
    return new Promise<fldsObject>((resolve, reject) =>
    {
      Promise.all([query({ tabname: 'node_attr' }), query({ tabname: 'fldvalues', exp:`tabname = 'node_attr'` })]).then(ret =>
      {
        const res: fldsObject = { flds:[], fldvalue:[] }
        if (ret[0].status == 200) res.flds = ret[0].data
        if (ret[1].status == 200) res.fldvalue = ret[1].data
        resolve(res)
      }).catch(reject)
    })
  }

  static getFuncList(nodeid: string)
  {
    return new Promise<Record<string, number[]>>((resolve, reject) =>
    {
      query({ tabname: 'func_memory', exp: `nodeid = ${nodeid}` }).then(res =>
      {
        const temp: Record<string, number[]> = {}
        if (res.status == 200)
        {
          res.data.forEach((item: any) =>
          {
            temp[item.tabname] = item.fldids.split(',').map((i: string) => Number(i))
          })
          resolve(temp)
        }
        resolve({})
      }).catch(reject)
    })
  }
  static async getNodeConfig(nodename: string)
  {
    const db = await createIndexedDB('power_sys')
    if (!db) return []
    return new Promise<collapseItem[]>((resolve, reject) =>
    {
      const res: collapseItem[] = []
      Promise.all(
        [
          findStore(db as IDBDatabase, 'node_params', { nodename }),
          findStore(db as IDBDatabase, 'fldvalues', { tabname: nodename })
        ])
        .then(ret =>
        {
          const fldvalues: dbvalueBase[] = ret[1]
          ret[0].forEach((item: nodeParams) =>
          {
            const f = res.find((i: collapseItem) => i.classify === item.classify)
            const _filter = fldvalues.filter((i: dbvalueBase) => i.colname === item.name).map(v => ({ ...v, nodename: v.tabname, name: v.colname }))
            item.ufunc = (item.ufunc ? JSON.parse(item.ufunc) : null)
            if (f)
              f.children.push({ ...item, fldvalue: _filter })
            else
              res.push({ classify: item.classify, classifydescribe: item.classifydescribe, children: [{ ...item, fldvalue: _filter }] })
          })
          resolve(res)
        }).catch(reject)
    })
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
  static async getDirectory()
  {
    return new Promise<any>((resolve, reject) =>
    {
      query({tabname:'node_dirs', orderby:'disporder'}).then(res =>
      {
        const ret = res.data
        ret.forEach((r:any)=>
        {
          r.children = []
        })
        resolve(res.data)
      }).catch(reject)
    })
   
  }

  static handlePorts(cellid:number, ports:any[])
  {
    const rets:any = []
    const _ports = ports.filter(p => p.cellid === cellid)
    _ports.forEach(p =>
    {
      if (p._group === 'out' || p._group === 'in')
      {
        rets.push({
          id: p.id+'',
          group: p._group,
          args: JSON.parse(p.args),
          attrs: JSON.parse(p.attrs),
          dimension: p.dimension
        })
      }
      else if (p._group === 'inline')
      {
        const args = JSON.parse(p.args)
        if (args.x instanceof Array && args.y instanceof Array && args.x.length===2 && args.y.length===2)
        {
          this.equidistributePors({ x: args.x[0], y: args.y[0] }, { x: args.x[1], y: args.y[1] }, args.dis ? args.dis : 4 / 160).forEach((_p, i) =>
          {
            rets.push({
              id: p.id + '_' + (i + 1),
              group: 'inline',
              args:
              {
                ..._p
              },
              dimension: p.dimension
            })
          })
        }
        
      }
    })
    return rets
  }
  static getNodeFormat()
  {
    return
  }
  static getSvgContent(src:string)
  {
    return new Promise<string>((resolve, reject) =>
    {
      fetch(src).then(r=>r.text().then(resolve)).catch(reject)
    })
  }
  static _getNodes()
  {
    const groups = common.getGrounps()
    return new Promise<any[]>((resolve, reject) =>
    {
      Promise.all([query({ tabname: 'node_cells' }), query({ tabname: 'node_ports', orderby:'disporder' })]).then(ret=>
      {
        const nodes: any = []
        const ports: any[] = ret[1].data
        ret[0].data.forEach(async(node:any, index:number) =>
        {
          // const svgTest = await common.getSvgContent(node.src)
          nodes.push({
            width: node.width,
            height: node.height,
            // shape: 'custom-svg',
            shape: 'image',
            namec: node.namec,
            label: node.namec,
            // svg: svgTest,
            attrs: {
              image: {
                'xlink:href': node.src,
              },
              ...this.commAttrs()
            },
            data: { ...node, ports: ports.filter(p => p.cellid === node.id), prjnodeInfo :{}},
            ports:
            {
              groups: groups,
              items: this.handlePorts(node.id, ret[1].data)
            }
          })
          if (index === ret[0].data.length - 1)
            resolve(nodes)
        })
       
      }).catch(reject)
    })
  }
  
  static commAttrs()
  {
    return {
      label: {
        refX: 0.5,
        refY: '100%',
        refY2: 4,
        textAnchor: 'middle',
        textVerticalAnchor: 'top',
        fontSize: 14,
        display: 'none'
      }
    }
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
            fontSize: 12,
            fill: '#888',
            display:'none',
          },
        },
        position:
        {
          name: 'absolute',
        },
        label: {
          position:
          {
            name: 'radial', // 标签位置
            args: { offset: 10 }
          }
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
          outcircle: // 添加一个外部圆圈,更容易选中
          {
            r: 4,
            magnet: true,
            stroke: 'transparent',
            strokeWidth: 0.1,
            fill: 'transparent',
          },
          circle:
          {
            r: 2,
            magnet: true,
            stroke: 'transparent',
            strokeWidth: 0.1,
            fill: 'transparent',
            // visibility: 'hidden', // 初始时隐藏连接桩
          },
          text:
          {
            fontSize: 12,
            fill: '#888',
            display:'none',
          },
        },
        position:
        {
          name: 'absolute',
        },
        label: {
          position:
          {
            name: 'radial', // 标签位置
            args: { offset: 10 }
          }
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
            fontSize: 12,
            fill: '#888',
            display:'none',
          },
        },
        position:
        {
          name: 'absolute',
          
        },
        label: {
          position:
          {
            name: 'radial', // 标签位置
            args: { offset: 10 }
          }
        }
      }
    }
    return groups
  }
}