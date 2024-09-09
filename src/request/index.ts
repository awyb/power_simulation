import http from './base'
function reqBase(type: string, params: any)
{
  return http.request({
    url: `/DataSvr/${type}`,
    method: 'POST',
    data: params
  })
}

export function query(params: any)
{
  return reqBase('query', params)
}
export function add(params: any)
{
  return reqBase('add', params)
}
export function del(params: any)
{
  return reqBase('delete', params)
}
export function update(params: any)
{
  return reqBase('update', params)
}
