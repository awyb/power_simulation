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
  children: Array<cellNode>
}
export interface dlgComponent {
  id: number,
  comp: Component,
  title: string,
  onOk: () => void
}

export interface graphRef {
  dragEnd: (x: number, y: number, node: object) => void
}

export interface pageDirectory {
  name: string,
  namec: string,
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
