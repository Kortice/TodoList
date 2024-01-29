// 封装关于task的api

// 
import { service } from '../utils/request.js'

// 添加task
export const addTask = (data, token) => {
  return service.request({
    method: 'post',
    url: '/task',
    headers: {Authorization: token},
    data
  })
}

// 获取task
export const getTask = (token) => {
  return service.request({
    method: 'get',
    url: '/task/0',
    headers: {Authorization: token},
  })
}

// 更新任务
export const updataTask = (tid, token, data) => {
  return service.request({
    method: 'put',
    url: `/task/${tid}`,
    headers: {Authorization: token},
    data
  })
}

// 删除任务
export const deleteTask = (tid, token) => {
  return service.request({
    method: 'delete',
    url: `/task/${tid}`,
    headers: {Authorization: token}
  })
}