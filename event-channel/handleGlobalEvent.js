/*
* 处理全局的管道事件
* */
const channel = require('./index')
const {eventTitle} = require('../config/settings')

// 数据库连接失败时， 回调
channel.on(eventTitle.mysqlConnectionFail, error => {
  /* logging processing */
  console.log("hello world event-channel")
})

