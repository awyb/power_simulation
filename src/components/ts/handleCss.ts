/**
 * 计算距离
 * @param   a        第一个参数
 * @param   b        第二个参数
 * @param   args     更多参数
 * @returns          css距离
 */
export function calcDis(a: string | number, b: string | number, ...args: (string | number)[])
{
  let dis = parseInt(a as string) + parseInt(b as string)
  args.forEach(n =>
  {
    dis += parseInt(n as string)
  })
  return dis + 'px'
}

/**
 * 获取css变量值
 * @param varName css变量名
 * @returns       css变量值
 */
export function getVarVal(varName: string)
{
  return getComputedStyle(document.documentElement).getPropertyValue(varName)
}