import { Component } from 'vue'
export interface dataNode {
  entityid: number,
  disporder: number,
  glid: number,
  dimension: number,
  src: string,
  name: string,
}

export interface cellNode {
  width: number,
  height: number,
  shape?: string,
  counter?: number,
  markup?:any,
  namec: string,
  label: string,
  attrs: object,
  data: dataNode,
  ports: object
}

export interface cellsList {
  id: number,
  name: string,
  namec: string,
  disporder: number,
  counter?: number,
  children: Array<cellNode>
}

export interface dlgComponent {
  id: number,
  comp: Component,
  title: string,
  params: object,
  attr: object,
  onOk: () => void
}

export interface graphRef {
  dragEnd: (x: number, y: number, node: object) => void
}

export interface pageDirectory {
  id: number,
  name: string,
  namec: string,
}
export interface description extends pageDirectory {
  icon: string,
  classify:string
}

export interface RightMenuEvent {
  open: (e: MouseEvent, menus: RightMenu, data: any) => void
}

export interface RightMenu {
  name: string,
  namec: string,
  icon?: string,
  keybord?: string,
  click:(data: any) => void
}

export interface variable {
  id: number;
  name: string;
  disporder: number;
  val: string;
  isval: number;
  prjid: number;
  expression: string;
}

export interface dbvalueBase {
  tabname: string,
  colname: string,
  dbvalue: string,
  disporder: number,
  disp: string,
  dispc: string
}

export interface nodeDbValue extends dbvalueBase {
  nodename: string,
  name: string,
}

export interface fldBase {
  name: string,
  namec: string,
  describe?: string,
  unit: string,
  disptype: number,
  defval: string,
  disporder: number,
  newedit?: number,
  editable?: number,
  nullable?: number,
  ufunc?: any,
  valid?: string,
  params?: string,
}

export interface nodeAttr extends fldBase {
  keyname: string,
  fldvalue?: nodeDbValue[]
}

export interface nodeParams extends attFld {
  nodename:string,
  classify: string,
  classifydescribe: string,
  keyname: string,
  fldvalue?: nodeDbValue[]
}

export interface attFld extends fldBase {
  id?: number,
  value: any,
  disabled: boolean,
  value_: any,
  isval: number,
  keyname?: string,
  focus?: boolean,
  fldvalue?: nodeDbValue[] | dbvalueBase[],
}

export interface fldsObject {
  flds: nodeAttr[],
  fldvalue: dbvalueBase[]
}

export interface collapseItem {
  classify: string,
  show?: boolean,
  classifydescribe: string,
  children: nodeParams[]
}
