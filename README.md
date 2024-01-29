# WarmUp

该项目运用了 Axios 框架与后端服务器发送网络请求与响应结果。

该项目将request和接口进行了封装，便于调用和维护。

该项目实现的接口有，用户的注册、登录，todo的增删改查。

由于本人开发时 pinia-plugin-persistedstate 插件亦或是浏览器出现问题，数据无法持久化保存在 localStorage 和 pinia 当中，用生命周期钩子进行挂载是获取数据，这也导致了页面抖动，待改进。