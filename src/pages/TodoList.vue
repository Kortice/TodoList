<template>
  <div class="container">
    <!-- 上层导航栏 -->
    <div class="header">
      <div class="nav">
        <RouterLink to="/todolist" active-class="active" >TodoList</RouterLink>
        <RouterLink to="/todoform" active-class="active" >表格展示</RouterLink>
      </div>
      <div class="account">
        <span>{{ accountUsername }}</span>
        <RouterLink to="/home/login" @click="exit">退出</RouterLink>
      </div>
    </div>
    <div class="outer">
      <!-- 页面左侧 -->
      <div class="left">
        <!-- 日历 -->
        <MyCalendar :dateSelect="dateSelect"/>
        <!-- 添加待办 -->
        <div class="add-task">
          <span class="title">Task</span>
          <div class="add-area">
            <textarea placeholder="请输入今日任务..." class="input-textarea" v-model="taskDetail"></textarea>
            <button class="add-task-btn" @click="addTodo"><div class="btn-text">添 加 至 待 办</div></button>
          </div>
        </div>
      </div>
      <!-- 页面右侧 -->
      <div class="right">
        <el-container class="container">
          <el-header class="header">
            <span class="title">待办</span>
            <div>
              <Search class="svg"/>
              <Star class="svg"/>
            </div>
          </el-header>
          <el-main class="main">
            <el-scrollbar max-height="600px" >
              <el-empty description="暂无待办" v-show="!todoList[0]" />
              <el-row v-for="todo in todoList" :key="todo.tid" >
                <el-col :span="24">
                  <el-card shadow="hover">
                    <div class="Ellipse"></div>
                    <span>{{ todo.content }}</span>
                  </el-card>
                </el-col>
              </el-row>
            </el-scrollbar>
          </el-main>
        </el-container>
      </div>
    </div>
  </div>
</template>

<script setup>
  name:'TodoList'
  components:{MyCalendar}

  import { onMounted, onBeforeUnmount } from 'vue'

  import { RouterLink, useRouter } from 'vue-router'
  import { reactive, ref } from 'vue'
  import { useAccountsStore } from '../stores/accounts.js'
  import { useTodoListStore } from '../stores/todoList.js'
  import { storeToRefs } from 'pinia'
  // import { nanoid } from 'nanoid'
  import MyCalendar from '../components/MyCalendar.vue'

  import { addTask, getTask } from '../api/task.js'
  import { useAuthStore } from '../stores/auth.js';
    
  // 数据
  const router = useRouter()
  const taskDate = ref(new Date())
  const taskDetail = ref('')
  const accountUsername = JSON.parse(localStorage.getItem('loginAccount')).username
  const token = JSON.parse(localStorage.getItem('loginAccount')).token

  // pinia里面的数据
  const accountsStore = useAccountsStore()
  const {accounts} = storeToRefs(accountsStore)
  const todoListStore = useTodoListStore()
  const { todoList } = todoListStore
  // const todoList = reactive(JSON.parse(localStorage.getItem('todoList')) || {todoList:[]})

  // 挂载的时候获取数据 和 token
  onMounted(() => {
    getTask(token)
    .then(
      res => {
        if (res.code === 200) {
          // 添加到todoList里面的数据
          todoListStore.setTodoList(res.data.item)
        }
      },
      err => {
        throw err
      }
    )
  })

  onBeforeUnmount(() => {
    todoListStore.clearTodoList()
  })
  
  //方法
  function dateSelect(selectDate) {
    taskDate.value = selectDate
  }

  // 添加todo

  function addTodo() {
    // 打包新的todoObj
    /* const todoObj = {
      id:nanoid(),
      todoThing:taskDetail.value,
      creationTime:taskDate.value.toLocaleDateString('zh-CN') + ' ' +  taskDate.value.getHours() + ':' + (taskDate.value.getMinutes() >= 10 ? '' : '0') + taskDate.value.getMinutes(),
      completionTime:'暂未完成',
      isDone:false
    }
    addNewTodo(todoObj)
    taskDetail.value = '' */

    // 打包新的todoObj
    const todoObj = {
      content: taskDetail.value,
      startTime: taskDate.value.toLocaleDateString('zh-CN') + ' ' +  taskDate.value.getHours() + ':' + (taskDate.value.getMinutes() >= 10 ? '' : '0') + taskDate.value.getMinutes(),
    }
    
    // 向服务器发送请求
    addTask(todoObj, token)
    .then(
      res => {
        if (res.code === 200) {
          // 获取新添进去的todo
          getTask(token)
          .then(
            res => {
              const newTodoObj = res.data.item[res.data.total - 1]
              todoListStore.addNewTodo(newTodoObj)
              taskDetail.value = ''
            },
            err => {
              throw err
            }
          )
        }
      },
      err => {
        throw err
      }
    ).catch(err => {
      throw err
    })
  }

  // 退出弹窗提示
  function exit() {
    ElMessage({
      message: '退出成功！',
      type: 'success',
    })
    // 将loginAccount清空
    localStorage.removeItem('loginAccount')
    // 将todoList清空
    localStorage.removeItem('todoList')
    todoListStore.clearTodoList()
    // 跳转走
    router.replace({
      path:'/'
    })
  }

</script>

<style scoped>
  a {
    text-decoration: none;
  }
  .active {
    font-size: 20px;
    font-weight: 800;
    line-height: 24px;
    color: #11240E;
  }
  .container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .header {
    height: 10vh;
    background-color: #DDEBDB;
    font-size: 20px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
  }
  .nav a,
  .account a {
    color: #11240E;
  }
  .account a {
    color: #263924;
  }
  .header .nav a:first-child,
  .header .account a {
    margin: 0 60px;
  }
  .outer {
    width: 100%;
    height: 90vh;
    display: flex;
    justify-content: space-between;
    background-color: #FAFCF9;
  }
  .left {
    width: 50%;
    background-color: #FAFCF9;
    display: flex;
    flex-direction: column;
  }
  .left :deep(*) {
    --el-calendar-border:0 ;
    --el-calendar-cell-width:31px;
    --el-calendar-selected-bg-color:none;
    --el-text-color-regular: #11240E;
  }
  .calendar,
  .add-task {
    margin-left: 60px;
    margin-top: 60px;
  }
  .calendar {
    width: 409.73px;
    height: 343.84px;
  }
  .calendar :deep(.el-calendar-day) {
    height: 31px;
  }
  .calendar :deep(.calendar-header) {
    font-size: 32px;
    font-weight: 800;
    line-height: 39px;
  }
  .calendar :deep(.p) {
    width: 31px;
    margin-left: 11px;
    margin-top: 1px;
    line-height: 29px;
  }
  .add-area {
    display: flex;
    align-items: center;
  }
  .add-task {
    display: flex;
    flex-direction: column;
  }
  .add-task .title {
    font-size: 32px;
    font-weight: 800;
    line-height: 39px;
    color: #11240E;
  }
  .add-task .input-textarea {
    width: 420px;
    height: 215px;
    border-radius: 10px;
    background-color: #DDEBDB;
    border: none;
    padding: 20px;
    font-size: 16px;
    font-weight: 600;
    line-height: 19px;
    resize: none;
    color: #B4AEAE;
  }
  .add-task-btn {
    width: 78px;
    height: 215px;
    border-radius: 10px;
    margin-left: 30px;
    font-size: 24px;
    font-weight: 700;
    line-height: 29px;
    background-color: #DDEBDB;
    border: none;
    cursor: pointer;
  }
  .btn-text {
    margin: 0 auto;
    writing-mode: vertical-lr;
  }
  .right {
    width: 50%;
    background-color: #FAFCF9;
  }
  .right .container {
    width: 90%;
    margin: 0 auto;
    margin-top: 60px;
  }
  .right .header {
    background-color: #FAFCF9;
  }
  .right .header .title {
    font-size: 32px;
    font-weight: 800;
    line-height: 39px;
    color: #11240E;
  }
  .right .header .svg {
    width: 26px;
    height: 26px;
  }
  .right .header .svg:first-child {
    margin-right: 20px;
  }
  .right .main .el-row {
    margin-bottom: 20px;
  }
  .right .main :deep(.el-card__body) {
    padding: 0;
    height: 74px;
    line-height: 74px;
    display: flex;
    align-items: center;
  }
  .right .main .el-card {
    border-radius: 10px;
  }
  .right .main .el-row .el-card {
    background-color: #D7EED3;
  }
  .right .main .Ellipse {
    width: 15px;
    height: 15px;
    border: 4px solid #456442;
    border-radius: 50%;
    margin: 0 20px;
    background-color: #FAFCF9;
  }
</style>
