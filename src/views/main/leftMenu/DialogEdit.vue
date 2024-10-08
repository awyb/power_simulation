<style scoped lang="less">
  .dialog-container { width: 100%;height: 100%;
    img{object-fit: contain;width: 100px;height: 100px;}
  }
</style>
<template>
  <div class="dialog-container">
    <img alt="picture" :src="props.params.data.src"/>
  </div>
</template>

<script lang="ts" setup name = 'DialogEdit'>
import { ref, reactive, defineProps } from 'vue'
const props = defineProps({
  params: {
    type: Object,
    default: () => ({})
  }
})
</script>