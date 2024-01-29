// 封装登录的api

// 
import { service } from '../utils/request.js'

// 发送登录请求
export const Login = (data) => {
  return service.request({
    method: 'post',
    url: '/user/login',
    data
  })
}