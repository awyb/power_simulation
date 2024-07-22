<style scoped lang="less">
.rightMenu {
  position: fixed;
  z-index: 99999999;
  cursor: pointer;
  padding: 30px;
  border: 1px solid #eee;
  box-shadow: 0 0.5em 1em 2px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  color: #606266;
  font-size: 14px;
  background: #fff;
}

.rightMenu ul {
  list-style: none;
  margin: 0;
  padding: 0;
  border-radius: 6px;
}

.rightMenu ul li {
  padding: 6px 10px;
  border-bottom: 1px solid #c8c9cc;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.rightMenu ul li:last-child {
  border: none;
}

.rightMenu ul li:hover {
  transition: all 0.5s;
  background: #EBEEF5;
  
}
.rightMenu ul li:hover {
  transition: all 0.5s;
  background: #EBEEF5;
}

.rightMenu ul li:first-child {
  border-radius: 6px 6px 0 0;
}
.rightMenu ul li:last-child {
  border-radius: 0 0 6px 6px;
}
</style>
<template>
  <!-- 右键菜单 -->
  <div class="rightMenu" v-show="showMenu" :style="{left: position.x + 'px', top: position.y + 'px'}">
      右键菜单
  </div>
</template>

<script lang="ts">
import { reactive, ref, defineComponent} from 'vue'
// 接收菜单信息

export default defineComponent({
  name: 'RightClickMenu',
  props:{
    menus: {
      type: Object,
      default: ()=>({}),
    }
  },
  setup(props, { expose })
  {
    const showMenu = ref(false)
    const position = reactive({x: 0, y: 0})

    // 关闭菜单
    function close()
    {
      showMenu.value = false
    }
    // 打开菜单和显示位置
    function open(event: MouseEvent)
    {
      // 阻止系统默认行为
      event.preventDefault()
      // 先关闭
      showMenu.value = false
      // 显示位置
      position.x = event.clientX
      position.y = event.clientY
      // 显示
      showMenu.value = true
      // 注册点击侦听事件
      document.addEventListener('click', close)
    }
    // 暴露方法
    expose({ open, close })
    return {showMenu, position}
  }
})

</script>


