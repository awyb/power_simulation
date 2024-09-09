<style scoped lang="less">
  .form-container {display: flex;align-items: center;margin:5px;
    .value-input{height: 30px;}
    .end-label {height: 30px;width: 30px;margin-left: 5px;line-height: 30px;font-size: 16px;font-weight: bold;cursor: pointer;}
    .icon-drag{cursor: pointer;}
  }
</style>
<template>
  <div class="form-container">
    <el-input v-model="values.name" class="name-input" style="width: 150px;"/>
    <el-input v-model="values.value" class="value-input" style="width: 180px;">
      <template v-if="!!values.isval" #suffix>{{ values.unit }}</template>
    </el-input>
    <label class="end-label" @click="values.isval = (values.isval+1)%2" v-html="!!values.isval?'(x)':'ƒ<sub>x</sub>'"></label>
    <i class="iconfont icon-drag" @contextmenu.prevent="handleRightClick($event)"></i>
  </div>
</template>

<script lang="ts">
import { reactive, ref, defineComponent, onMounted, watch} from 'vue'
import eveBus from '@/components/ts/eveBus'
export default defineComponent({
  name: 'VarForm',
  props:{
    params: {
      type: Object,
      default: ()=>({name:'', value:'', isval:1}),
    },
    menus: {
      type: Array,
      default: ()=>([])
    }
  },
  setup(props, { expose })
  {
    const values = reactive(props.params)
    function handleRightClick(e:MouseEvent)
    {
      e.preventDefault()
      eveBus.emit('right-menu', { e, menus: props.menus, data:values })
    }
    expose({})
    return {
      values,
      handleRightClick
    }
  }
})

</script>


