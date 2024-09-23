import { query } from '@/request'
import { openStore, updateStore, findStore, closeDB } from '@/indexedDB'
let indexedDB: IDBDatabase | null
export const init = () =>
{
  Promise.all([
    query({ tabname: 'node_params', orderby: 'cla_disporder,disporder' }),
    query({ tabname: 'fldvalues', orderby: 'disporder' })
  ])
    .then(ret =>
    {
      console.log(ret)
    }).catch(err=>console.log(err))

}
export const createIndexedDB = async() =>
{
  // 创建
  indexedDB = await openStore({
    databaseName: 'power',
    storeName: 'room',
    keyPath: 'id',
    indexes: ['width', 'height', 'length'],
  })
  if (indexedDB)
  {
    // 添加
    updateStore(indexedDB, 'room', { width: 50, height: 20, length: 60 })
  }
  if (indexedDB)
  {
    let res = await findStore(indexedDB, 'room')
    console.log(res)
  }
}
export const closeIndexedDB = () =>
{
  if (indexedDB)
    closeDB(indexedDB)
}