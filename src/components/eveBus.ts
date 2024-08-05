import mitt from 'mitt'
 
// export default mitt();
 
// 也可以写完整的
 
const emitter = mitt()
// 每调用一个mitt,都是一个总线,所以这里为什么要封装为一个工具库,就是只使用一个总线
 
export default emitter