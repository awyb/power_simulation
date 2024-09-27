<template>
<el-aside :style="{ width: `${asideWidth}px` }">
      <div>Aside Content</div>
      <div class="resizer" @mousedown="startResizing"></div>
    </el-aside>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
const asideWidth = ref<number>(300) // 初始宽度
let isResizing = false
let startX = 0
let startWidth = 0
 
const startResizing = (event: MouseEvent) =>
{
  isResizing = true
  startX = event.clientX
  startWidth = asideWidth.value
 
  document.addEventListener('mousemove', resizeAside)
  document.addEventListener('mouseup', stopResizing)
}
 
const resizeAside = (event: MouseEvent) =>
{
  if (isResizing)
  {
    const newWidth = startWidth + (event.clientX - startX)
    asideWidth.value = newWidth > 50 ? newWidth : 50 // 设置最小宽度为 50px
  }
}
 
const stopResizing = () =>
{
  isResizing = false
  document.removeEventListener('mousemove', resizeAside)
  document.removeEventListener('mouseup', stopResizing)
}
 
onMounted(() =>
{
  document.addEventListener('mouseup', stopResizing)
})

</script>
<style scoped>
.el-aside {
  position: relative;
}
 
.resizer {
  position: absolute;
  top: 0;
  right: 0;
  width: 5px;
  height: 100%;
  cursor: ew-resize;
  background-color: rgba(0, 0, 0, 0.2);
}
</style>