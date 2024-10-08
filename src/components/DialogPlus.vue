<style scoped lang="less">
  .modal-overlay {position: fixed;top: 0;left: 0;right: 0;background: rgba(0, 0, 0, 0.5);display: flex;justify-content: center;align-items: center;z-index: 9;}
  .modal {background: white;border-radius: 5px;box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);position: absolute;cursor: move;border-radius: 10px;color: white;}
  .modal-header {display: flex;justify-content: space-between;align-items: center;padding: 0 15px; height: 35px;background: rgb(43, 170, 255);border-top-left-radius: 10px;border-top-right-radius: 10px;
    .modal-oper {
      .iconfont {cursor: pointer;margin: 0 5px;
        &:hover {color: #0099ff;}
      }
    }
  }
  .modal-content {margin: 10px;position: relative;height: calc(100% - 85px);width: calc(100% - 20px); overflow: auto;color: black;}
  .modal-footer {height: 30px;display: flex;align-items: center;justify-content: center;width: 40%;margin: auto;}
</style>
<template>
  <div v-if="showModal"
    class="modal-overlay"
    :style="{ bottom: defUicfg.modal ? 0 : 'initial'}"
    @click.self="closeOnClickOverlay ? closeModal() : null">
    <div class="modal"
      :style="{ width: modalWidth + 'px', height: (expand?modalHeight:30) + 'px', left: modalX + 'px', top: modalY + 'px' }"
      @mousedown="startDrag"
      @mouseup="stopDrag"
      @mousemove="dragging ? drag($event) : null"
    >
      <div style="width: 1px;height: 100%;position: absolute;top: 0;right: 0;cursor: e-resize;" @mousedown.stop="(e)=>startResize(e,'right')"></div>
      <div style="height: 1px;width: 100%;position: absolute;bottom: 0;left: 0;cursor: s-resize;" @mousedown.stop="(e)=>startResize(e,'bottom')"></div>
      <div class="modal-header">
        <label>{{ title }}</label>
        <div class="modal-oper">
          <i :class="'iconfont icon-modal-'+(expand?'expand':'fold')" @click="expand=!expand"></i>
          <i class="iconfont icon-close" @click="closeModal"></i>
        </div>
      </div>
      <div class="modal-content">
        <slot name="content"></slot>
      </div>
      <div class="modal-footer">
        <el-button type="text" @click="closeModal">
          <i class="iconfont icon-sure"></i>
          确定
        </el-button>
        <el-button type="text" @click="closeModal" text="info">
          <i class="iconfont icon-cancel"></i>
          取消
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="DialogPlus">
import { ref, defineProps, defineEmits, watch } from 'vue'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  closeOnClickOverlay: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: 'Dialog Plus'
  },
  uicfg: {
    type: Object,
    default: () => ({})
  }
})

const defUicfg:{ [key: string]: any } = ref({
  width: 700,
  height: 500,
  left: 0.5,
  top: 0.5,
  modal: true,
})
defUicfg.value = { ...defUicfg.value, ...props.uicfg }
if (defUicfg.value.left <= 1)
  defUicfg.value.left = defUicfg.value.left * window.innerWidth
if (defUicfg.value.top <= 1)
  defUicfg.value.top = defUicfg.value.top * window.innerHeight
defUicfg.value.left = defUicfg.value.left - defUicfg.value.width / 2
defUicfg.value.top = defUicfg.value.top - defUicfg.value.height / 2

const emits = defineEmits(['update:modelValue'])
const expand = ref(true)
const showModal = ref(props.modelValue)
const modalWidth = ref(defUicfg.value.width)
const modalHeight = ref(defUicfg.value.height)
const modalX = ref(defUicfg.value.left)
const modalY = ref(defUicfg.value.top)
const dragging = ref(false)
const resizing = ref(false)
const startX_ = ref(0)
const startY_ = ref(0)
const startWidth_ = ref(0)
const startHeight_ = ref(0)
const startLeft = ref(0)
const startTop = ref(0)
let direct = 'right'

watch(() => props.modelValue, (newValue) =>
{
  showModal.value = newValue
})
const closeModal = () =>
{
  showModal.value = false
  emits('update:modelValue', false)
}

const startDrag = (event: MouseEvent) =>
{
  dragging.value = true
  startX_.value = event.clientX
  startY_.value = event.clientY
  startLeft.value = modalX.value
  startTop.value = modalY.value
}

const stopDrag = () =>
{
  dragging.value = false
}

const drag = (event: MouseEvent) =>
{
  if (dragging.value)
  {
    modalX.value = startLeft.value + (event.clientX - startX_.value)
    modalY.value = startTop.value + (event.clientY - startY_.value)
  }
}

const startResize = (event:MouseEvent, direction: 'top' | 'right' | 'bottom' | 'left') =>
{
  direct = direction
  resizing.value = true
  if (direction === 'bottom')
  {
    startY_.value = event.clientY
    startHeight_.value = modalHeight.value
  }
  else if (direction === 'right')
  {
    startX_.value = event.clientX
    startWidth_.value = modalWidth.value
  }
  event.preventDefault() // 防止文本选择
}

const stopResize = () =>
{
  resizing.value = false
}

const resize = (event: MouseEvent) =>
{
  if (resizing.value)
  {
    if (direct === 'right')
      modalWidth.value = startWidth_.value + (event.clientX - startX_.value)
    else if (direct === 'bottom')
      modalHeight.value = startHeight_.value + (event.clientY - startY_.value)
  }
}
window.addEventListener('mouseup', stopResize)
window.addEventListener('mousemove', resize)

</script>