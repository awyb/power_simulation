interface openStoreType {
  databaseName: string,
  storeName: string[] | string,
  keyPath: string,
  indexes?: { [key: string]: string[] } | string[]
}

export const openStore = ({ databaseName, storeName, keyPath, indexes = {}}: openStoreType): Promise<IDBDatabase | null> =>
{
  return new Promise((resolve, reject) =>
  {
    // 打开indexedDB
    let request = window.indexedDB.open(databaseName, 1)

    request.onsuccess = (evt: Event) =>
    {
      resolve((evt.target as IDBOpenDBRequest).result)
    }

    request.onerror = (evt: Event) =>
    {
      reject(new Error(JSON.stringify(evt)))
    }

    request.onupgradeneeded = (evt: IDBVersionChangeEvent) =>
    {
      if ((evt?.target as IDBOpenDBRequest)?.result)
      {
        const { result } = evt.target as IDBOpenDBRequest
        const arr = Array.isArray(storeName) ? storeName : [storeName]
        arr.forEach(name =>
        {
          const store = result.createObjectStore(name, { keyPath }) // autoIncrement: true
          const indexObj = Array.isArray(indexes) ? { [name]: indexes } : indexes
          // 创建索引
          if (indexObj)
          {
            for (let i in indexObj[name])
              store.createIndex(indexObj[name][i], indexObj[i], { unique: false })
          }
          // 创建数据对象成功
          store.transaction.oncomplete = (evt: any) =>
          {
            // console.log('object store create success!', evt)
          }
        })
      }
      else
        console.log('indexedDb upgrade fail!', evt)
    }
  })
}

// 修改（put）
export const updateStore = async(db: IDBDatabase, storeName: string, data: any): Promise<boolean> =>
{
  return new Promise((resolve, reject) =>
  {
    // 获取store对象
    let store = db.transaction([storeName], 'readwrite').objectStore(storeName)
    // 添加或修改数据
    const request = store.put({ ...data, updateAt: new Date() })

    request.onsuccess = (evt: Event) =>
    {
      // console.log('update success!', evt)
      resolve(true)
    }

    request.onerror = (evt: Event) =>
    {
      reject(new Error(JSON.stringify(evt)))
    }
  })
}
// 修改（put）
export const addStore = async(db: IDBDatabase, storeName: string, data: any): Promise<boolean> =>
{
  return new Promise((resolve, reject) =>
  {
    // 获取store对象
    const transaction = db.transaction([storeName], 'readwrite')
    const objectStore = transaction.objectStore(storeName)
    // 添加或修改数据
    const adds = Array.isArray(data) ? data : [data]
    adds.forEach(item =>
    {
      const request = objectStore.get(item.id)
      request.onsuccess = function()
      {
        if (!request.result)
          objectStore.add(item)
        // console.log('数据插入成功:', item)
      }
      request.onerror = function()
      {
        // console.error('数据插入失败:', item)
      }
    })

    transaction.oncomplete = function(this: IDBTransaction, evt: Event)
    {
      console.log('事务完成:', this, evt)
      resolve(true)
    }

    transaction.onerror = function(this: IDBTransaction, evt: Event)
    {
      console.log('事务失败:', this, evt)
      reject(new Error('事务失败'))
    }
  })
}
// 根据key删除对应数据
export const deleteStore = async(db: IDBDatabase, storeName: string, key: string | number): Promise<boolean> =>
{
  return new Promise((resolve, reject) =>
  {
    // 获取store对象
    let store = db.transaction([storeName], 'readwrite').objectStore(storeName)
    // 根据key删除数据
    const request = store.delete(key)

    request.onsuccess = (evt: Event) =>
    {
      console.log('delete success!', evt)
      resolve(true)
    }

    request.onerror = (evt: Event) =>
    {
      reject(new Error(JSON.stringify(evt)))
    }
  })
}

// 获取所有数据
export const findStore = (db: IDBDatabase, storeName: string, qryExp?: { [key: string]: any }): Promise<any[]> =>
{
  return new Promise((resolve, reject) =>
  {
    // 获取store对象
    let store = db.transaction([storeName], 'readwrite').objectStore(storeName)

    // const request = store.getAll()
    const request = store.openCursor()
    const ret: any[] = []
    const fl = (val: any) =>
    {
      let flag = true
      if (!qryExp)
        return flag
      Object.keys(qryExp).forEach(key =>
      {
        if (val[key] !== qryExp[key])
          flag = false
      })
      return flag
    }
    request.onsuccess = (evt: Event) =>
    {
      // console.log('get all data success!', evt)
      // resolve((evt.target as any).result)
      let cursor = (evt.target as any).result
      if (cursor)
      {// 如果存在
        if (fl(cursor.value))
          ret.push(cursor.value)
        cursor.continue()// 继续下一个
      }
      else
        resolve(ret)
    }

    request.onerror = (evt: Event) =>
    {
      reject(new Error(JSON.stringify(evt)))
    }
  })
}

// 获取一条数据
export const findOneStore = (db: IDBDatabase, storeName: string, key: number | string): Promise<any> =>
{
  return new Promise((resolve, reject) =>
  {

    let store = db.transaction([storeName], 'readwrite').objectStore(storeName)

    const request = store.get(key)

    request.onsuccess = (evt: Event) =>
    {
      console.log('get data success!', evt)
      resolve((evt.target as any).result)
    }

    request.onerror = (evt: Event) =>
    {
      reject(new Error(JSON.stringify(evt)))
    }
  })
}

// 清空所有数据
export const clearAll = (db: IDBDatabase, storeName: string): Promise<boolean> =>
{
  return new Promise((resolve, reject) =>
  {

    let store = db.transaction([storeName], 'readwrite').objectStore(storeName)

    const request = store.clear()

    request.onsuccess = (evt: Event) =>
    {
      console.log('clear data success!', evt)
      resolve(true)
    }

    request.onerror = (evt: Event) =>
    {
      reject(new Error(JSON.stringify(evt)))
    }
  })
}

export const closeDB = (db: IDBDatabase) =>
{
  return new Promise((resolve, reject) =>
  {
    db.close()
    resolve('数据库已关闭')
  })
}
