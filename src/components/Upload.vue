<template>
  <el-upload
    ref="upload"
    action="#"
    drag
    accept=".json"
    :on-change="handleChange"
    :auto-upload="false"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      Drop file here or <em>click to upload</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        json files with a size less than 10M
      </div>
    </template>
  </el-upload>
</template>

<script lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Upload',
  components: {
    UploadFilled
  },
  emits: ['read-success', 'close'],
  setup(_, { emit })
  {
    function handleChange(file: { raw: Blob })
    {
      // 当文件状态发生变化时调用
      const reader = new FileReader()
 
      reader.onload = (e) =>
      {
        emit('read-success', e.target?.result)
        emit('close')
      }
 
      reader.onerror = function(error)
      {
        console.log('Error: ', error)
      }
 
      reader.readAsText(file.raw) // 读取文件内容
    }
    return { handleChange}
  }
})
</script>