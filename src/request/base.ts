import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { baseURL_dev } from '../../public/static/config/baseUrl'
import { useRouter } from 'vue-router'
const router = useRouter()// 当前页面的路由对象


class HttpRequest
{
  private readonly baseUrl: string;
  constructor()
  {
    this.baseUrl = baseURL_dev + '/api'
  }
  getInsideConfig()
  {
    let token = localStorage.getItem('Token')
    if (token)
    {
      token = 'Bearer ' + token
      console.log(token, 'token1')

    }
    else
    {
      // router.push('/');
      token = '913ed069-8194-4119-a036-ad20e7090171'
      console.log(token, 'token2')

    }
    const config = {
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': token
      },
    }
    return config
  }

  // 请求拦截
  interceptors(instance: AxiosInstance, url: string | number | undefined)
  {
    instance.interceptors.request.use((config: any) =>
    {
      // 添加全局的loading..
      // 请求头携带token
      return config
    }, (error: any) =>
    {
      return Promise.reject(error)
    })

    // //响应拦截
    instance.interceptors.response.use((res: any) =>
    {
      // debugger;
      const { data } = res
      console.log('返回数据处理', res)
      return data
    }, (error: any) =>
    {
      console.log('error==>', error)
      if (error.response && error.response.status === 401)
      {
        // 尝试从本地存储获取新的token
        const newToken = localStorage.getItem('Token')

        if (newToken)
        {
          // 设置新的token到请求头中
          // instance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          localStorage.removeItem('Token')
          // localStorage.removeItem('token_type')
          router.push({ path: '/login' })
        }
        else
        {
          // 如果没有新token，清除旧的token并跳转到登录页
          localStorage.removeItem('Token')
          router.push('/login')
        }
      }
      else if (error.code == 403 || error.code == 401 || error.code == 404 || error.code == 500 || error.code == 502)

        router.push('/404')


      // window.location.reload();
      // return Promise.reject(error)
    })
  }

  request(options: AxiosRequestConfig)
  {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

const http = new HttpRequest()
export default http