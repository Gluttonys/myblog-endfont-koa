const fs = require('fs')

const Koa = require('koa')
const Router = require('koa-router')
const bodyPaser = require('koa-bodyparser')
const {loadRouter} = require('./utils/loadRouter')

require('./event-channel/handleGlobalEvent')
require('./model/main')

const app = new Koa()
const router = new Router()

/* set the global root directory */
app.context.rootPath = __dirname

/* post request parameter resolution */
app.use(bodyPaser())

/* Dynamically import all interface files under the Router folder */
loadRouter('router/', router, app, __dirname)


/* configuration of cross domain */
app.use(async (ctx, next)=> {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200;
  } else {
    await next();
  }
});

app.listen(3000, () => {
  console.log(`The server has been started, requesting a concrete interface to retrieve the data ~`)
})

module.exports = app

// 接口文档地址
// https://www.showdoc.com.cn/1198970017278877

