
import { variable } from '@/components/interface/interfaceBase'
function arrayToMap(array: variable[]): Record<number, variable>
{
  return array.reduce((acc, item) =>
  {
    acc[item.id] = item
    return acc
  }, {} as Record<number, variable>)
}
export function compareArrays(oldArray: variable[], newArray: variable[])
{
  const oldMap = arrayToMap(oldArray)
  const newMap = arrayToMap(newArray)

  const added: variable[] = []
  const removed: variable[] = []
  const updated: { old: variable; new: variable }[] = []

  // 查找新增和更新的项
  for (const id in newMap)
  {
    if (!oldMap[id])
      added.push(newMap[id])
    else if (JSON.stringify(oldMap[id]) !== JSON.stringify(newMap[id]))
      updated.push({ old: oldMap[id], new: newMap[id] })
  }

  // 查找删除的项
  for (const id in oldMap)
  {
    if (!newMap[id])
      removed.push(oldMap[id])
  }

  return { added, removed, updated }
}
