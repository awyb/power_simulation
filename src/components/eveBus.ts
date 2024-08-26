import mitt from 'mitt'
 
// export default mitt();
 
 
const emitter = mitt()
// 每调用一个mitt,只使用一个总线
 
export default emitter