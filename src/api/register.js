// 封装注册的api

// 
import { service } from '../utils/request.js'

// 发送注册请求
export const Register = (data) => {
  return service.request({
    method: 'post',
    url: '/user/register',
    data
  })
}