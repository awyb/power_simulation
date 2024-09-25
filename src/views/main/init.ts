import { query } from '@/request'
import { openStore, updateStore, findStore, closeDB } from '@/indexedDB'
const databaseName = 'power_sys' // 数据库名称
const syscache = [
  { tabname: 'node_params', exp: 'id>0', orderby: 'cla_disporder,disporder' },
  { tabname: 'fldvalues', exp: 'id>0', orderby: 'disporder' }
]
function getCacheData(db: IDBDatabase | null)
{
  if (!db) return
  const all: any = []
  syscache.forEach(q =>
  {
    all.push(query(q))
  })
  // 初始化数据
  Promise.all(all)
    .then(ret =>
    {
      ret.forEach((res, index) =>
      {
        if (res.status === 200)
        {
          res.data.forEach((data:any) =>
          {
            updateStore(db, syscache[index].tabname, data)
          })
        }
      })
    })
    .catch(err => console.log(err))
}
export const init = () =>
{
  // 初始化字段
  query({ tabname: 'flds' })
    .then(res =>
    {
      if (res.status !== 200)
        return
      const data = res.data
      const obj:{ [key: string]: string[]} = {}
      syscache.forEach(table =>
      {
        const flds = data.filter((item: any) => item.tabname === table.tabname)
        obj[table.tabname] = flds.map((f: any) => f.name)
      })
      createIndexedDB(syscache.map((t: any) => t.tabname), obj).then(db =>
      {
        getCacheData(db)
      })
    })
    .catch(err =>
    {
      console.log(err)
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