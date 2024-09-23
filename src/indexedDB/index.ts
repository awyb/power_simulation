interface openStoreType {
  databaseName: string,
  storeName: string,
  keyPath: string,
  indexes?: Array<string>
}

export const openStore = ({ databaseName, storeName, keyPath, indexes = [] }: openStoreType): Promise<IDBDatabase | null> =>
{
  return new Promise((resolve, reject) =>
  {
    // 打开indexedDB
    let request = window.indexedDB.open(databaseName, 1)

    request.onsuccess = (evt: Event) =>
    {
      console.log('indexedDB open success!', evt)
      resolve((evt.target as IDBOpenDBRequest).result)
    }

    request.onerror = (evt: Event) =>
    {
      console.log('indexedDb open fial!', evt)
      reject(null)
    }

    request.onupgradeneeded = (evt: IDBVersionChangeEvent) =>
    {
      if ((evt?.target as IDBOpenDBRequest)?.result)
      {
        const { result } = evt.target as IDBOpenDBRequest
        // 创建数据对象
        const store = result.createObjectStore(storeName, { autoIncrement: true, keyPath })
        // 创建索引
        for (let i in indexes)
        
          store.createIndex(indexes[i], indexes[i], { unique: true })
        
        // 创建数据对象成功
        store.transaction.oncomplete = (evt: any) =>
        {
          console.log('object store create success!', evt)
        }
        console.log('indexedDb upgrade success!', evt)
      }
      else
      
        console.log('indexedDb upgrade fail!', evt)
      
    }
  })
}

// 新增（add），修改（put）
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
      console.log('update success!', evt)
      resolve(true)
    }

    request.onerror = (evt: Event) =>
    {
      console.log('update fail!', evt)
      reject(false)
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
      console.log('delete fail!', evt)
      reject(false)
    }
  })
}

// 获取所有数据
export const findStore = (db: IDBDatabase, storeName: string): Promise<any[]> =>
{
  return new Promise((resolve, reject) =>
  {
    // 获取store对象
    let store = db.transaction([storeName], 'readwrite').objectStore(storeName)

    const request = store.getAll()

    request.onsuccess = (evt: Event) =>
    {
      console.log('get all data success!', evt)
      resolve((evt.target as any).result)
    }

    request.onerror = (evt: Event) =>
    {
      console.log('get all data fail!', evt)
      reject([])
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
      console.log('get data fail!', evt)
      reject([])
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
      console.log('clear data fail!', evt)
      reject(false)
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
