// 引入 axios
import axios from "axios"

// 创建 axios 实例对象
export const service = axios.create({
  baseURL: 'http://47.113.145.156:8081',
  // withCredentials: true // 是否携带 cookie
})

// 添加请求拦截器
service.interceptors.request.use(
  config => {
    config.headers['Access-Control-Allow-Origin'] = '*'
    return config
  },
  err => Promise.reject(err)
)

// 添加响应拦截器
service.interceptors.response.use(
  response => response.data ,
  err => Promise.reject(err)
)

export default service
