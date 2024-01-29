import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useTodoListStore = defineStore('todoList', ()=>{
  // 数据
  const todoList = reactive([])

  // 方法

  // 设置todoList
  const setTodoList = (todoArr) => {
    todoList.push(...todoArr)
  }

  // 增加todo
  const addNewTodo = (todoObj) => {
    todoList.push(todoObj)
  }

  // 完成todo
  const handleCompelete = (id, time) => {
    todoList.forEach(todo => {
      if (todo.tid === id) {
        todo.status = 1
        todo.endTime = time
      }
    })
    
  }

  // 修改todo
  const handleEdit = (id, value) => {
    todoList.forEach(todo => {
      if (todo.tid === id) {
        todo.content = value
      }
    })
  }

  // 删除todo
  const handleDelete = id => {
    todoList.forEach((todo, index) => {
      if (todo.tid === id) {
        todoList.splice(index, 1)
      }
    })
  }

  // 清空todoList
  const clearTodoList = () => {
    todoList.splice(0)
  }

  // 返回相关的数据
  return {
    todoList,
    setTodoList,
    addNewTodo,
    handleCompelete,
    handleEdit,
    handleDelete,
    clearTodoList
  }

}, {
  persist: true
})
