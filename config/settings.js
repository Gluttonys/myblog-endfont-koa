/*
* 存放全局配置
* */

/*
* 数据库配置
* squelize
* https://www.sequelize.com.cn/core-concepts/getting-started
* */
const mysqlConfig = {
  title: 'mysql',
  user: 'root',
  password: 'root',
  database: "myblog_koa",
  host: 'localhost',
  port: 3306
}

/*
* 全局的事件类型
* */
const eventTitle = {
  mysqlConnectionFail: "mysql Connection Fail"
}

/*
* 全局默认分页
* */
const defaultConfig = {
  offset: 0,
  limit: 30
}

/*
*
* 常见状态码
* */
const statusCode = {
  200: 200, // 表示从客户端发送给服务器的请求被正常处理并返回；
  204: 204, // 正常处理， 但是没有返回任何资源
  206: 206, // 表示客户端进行了范围请求，并且服务器成功执行了这部分的GET请求，响应报文中包含由Content-Range指定范围的实体内容。
  301: 301, // 永久重定向
  302: 302, // 临时重定向
  303: 303, // 请将post 方法变更为 get 方法重新请求
  307: 307, // 临时重定向， 与303有着相同的含义，307会遵照浏览器标准不会从POST变成GET
  400: 400, // 错误请求， 请求中可能存在错误
  401: 401, // 操作是未经许可的
  403: 403, // 没权限
  404: 404, // 找不到对应的资源
  500: 500, // 服务器内部执行请求时发生的意外的错误， 我们简称BUG，
  503: 503, // 服务器正在过载运行， 暂时无法处理请求
}


module.exports = {
  mysqlConfig,
  eventTitle,
  defaultConfig,
  statusCode
}

