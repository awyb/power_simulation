import { query } from '@/request'
import { openStore, addStore, closeDB } from '@/indexedDB'
const databaseName = 'power_sys' // 数据库名称
const syscache = [
  { tabname: 'node_params', exp: 'id>0', orderby: 'cla_disporder,disporder' },
  { tabname: 'fldvalues', exp: 'id>0', orderby: 'disporder' }
]

export function setDataInDB(db: IDBDatabase | null, data:{ [key: string]: any })
{
  if (!db) return
  const que: any = []
  Object.keys(data).forEach(name =>
  {
    que.push(addStore(db, name, data[name]))
  })
  return new Promise<any>((resolve, reject) =>
  {
    return Promise.all(que).then(resolve).catch(reject)
  })
  
}
export function getCacheData()
{
  const all: any = []
  const rets: { [key: string]: any } = {}
  syscache.forEach(q =>
  {
    all.push(query(q))
  })
  return new Promise<any>((resolve, reject) =>
  {
    // 初始化数据
    Promise.all(all)
      .then(ret =>
      {
        ret.forEach((res, index) =>
        {
          if (res.status === 200)
            rets[syscache[index].tabname] = res.data
        })
        resolve(rets)
      })
      .catch(reject)
  })
  
}
export const initDB = () =>
{
  // 初始化字段
  return new Promise <IDBDatabase | null>((resolve, reject) =>
  {
    query({ tabname: 'flds' })
      .then(res =>
      {
        if (res.status !== 200)
          resolve(null)
        const data = res.data
        const obj: { [key: string]: string[] } = {}
        syscache.forEach(table =>
        {
          const flds = data.filter((item: any) => item.tabname === table.tabname)
          obj[table.tabname] = flds.map((f: any) => f.name)
        })
        createIndexedDB(syscache.map((t: any) => t.tabname), obj).then(db =>
        {
          resolve(db)
        })
      })
      .catch(reject)
  })

}
export const createIndexedDB = (storeName:string[]|string, indexes = {}) =>
{
  // 创建
  return new Promise<IDBDatabase | null>((resolve, reject) =>
  {
    openStore({
      databaseName,
      storeName,
      indexes,
      keyPath: 'id'
    }).then(db =>
    {
      resolve(db)
    }).catch(reject)
  })
}
export const closeIndexedDB = (indexedDB: IDBDatabase) =>
{
  if (indexedDB)
    closeDB(indexedDB)
}