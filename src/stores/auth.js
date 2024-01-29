import { defineStore } from "pinia"
import { reactive } from "vue"

export const useAuthStore = defineStore('auth', () => {
  // 数据
  const tokens = reactive([])

  // 方法

  // 往tokens里面添加新的对象
  const addToken = (newTokenObj) => {
    // 遍历tokens找相同的
    tokens.forEach((item, index) => {
      if (item.username === newTokenObj.username) {
        tokens.splice(index, 1)
      }
    })
    tokens.push(newTokenObj)
  }

  return {
    tokens,
    addToken
  }
},{
  persist: true
})