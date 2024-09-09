<style scoped lang="less">
.rightMenu { position: fixed;padding: 5px 10px;z-index: 999;cursor: pointer;border: 1px solid #eee;box-shadow: 0 0.5em 1em 2px rgba(0, 0, 0, 0.1);border-radius: 6px;color: #606266;font-size: 14px;background: #fff;
  li { display: flex;align-items: center;justify-content: space-between; padding: 10px 20px 10px 10px; cursor: pointer;
    span:nth-child(2) { color: #a8a8a8;font-style: italic;font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;padding-left: 20px; }
    &:hover { background-color: #f0f0f0; }
    .iconfont { margin-right: 5px;}
  }
}
</style>
<template>
  <!-- 右键菜单 -->
  <ul ref="rightMenu" class="rightMenu" v-show="showMenu" :style="{left: position.x + 'px', top: position.y + 'px'}" @contextmenu.prevent>
    <li v-for="(menu,index) in menus" :key="index" @click="menu.click(_data)">
      <span><i :class="menu.icon"></i>{{ menu.namec }}</span>
      <span>{{ menu.keybord }}</span>
    </li>
  </ul>
</template>

<script lang="ts">
import { reactive, ref, defineComponent, nextTick} from 'vue'
// 接收菜单信息
import { RightMenu } from '@/components/interface/interfaceBase'
export default defineComponent({
  name: 'RightClickMenu',
  setup(props, { expose })
  {
    const showMenu = ref(false)
    const position = reactive({x: 0, y: 0})
    const _data = ref(null)
    const rightMenu = ref(null)
    const menus = ref<RightMenu[]>([])
    // 关闭菜单
    function close()
    {
      showMenu.value = false
    }
    // 打开菜单和显示位置
    async function open(event: MouseEvent, _menus:RightMenu[], data:any)
    {
      // 阻止系统默认行为
      event.preventDefault()
      menus.value = _menus
      // 显示
      showMenu.value = true
      _data.value = data
      await nextTick()
      // 显示位置
      const right = document.documentElement.clientWidth - event.clientX
      const bottom = document.documentElement.clientHeight - event.clientY
      position.x = right > (rightMenu.value as any)?.offsetWidth ? event.clientX : event.clientX - (rightMenu.value as any)?.offsetWidth
      position.y = bottom > (rightMenu.value as any)?.offsetHeight ? event.clientY : event.clientY - (rightMenu.value as any)?.offsetHeight
      
      
      // 注册点击侦听事件
      document.addEventListener('click', close)
    }
    // 暴露方法
    expose({ open, close })
    return {showMenu, position, _data, rightMenu, menus}
  }
})

</script>


