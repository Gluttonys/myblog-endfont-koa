const Router = require('koa-router')
const {defaultConfig, statusCode} = require('../config/settings')
const loggerRouter = new Router()
const Logger = require('../model/logger')


loggerRouter.get('/logger-list', async (ctx, next) => {
  await next()
  let pagingConfig = {  // 前端传过来的都是字符串形式，所以要转一下数字
    offset: ~~(ctx.query.offset) || defaultConfig.offset,
    limit: ~~(ctx.query.limit) || defaultConfig.limit
  }
  let count = 0, loggerList = [], status = statusCode['200']

  try {
    loggerList = await Logger.findAll({...defaultConfig})
    count = await Logger.count()
  } catch (e) {
    status = statusCode['500']
  }

  if (status === statusCode['500']) {
    ctx.body = {
      status,
      mess: '查询失败~'
    }
  } else {
    ctx.body = {
      count,
      loggerList,
      ...pagingConfig,
      status,
    }
  }
})


loggerRouter.get('/del-by-id', async (ctx, next) => {
  await next()
  let id = ctx.query.id, status = statusCode['200']
  id = id.includes(',') ? id.split(',').map(el => ~~el) : [~~id]

  try {
    for (const el of id) {
      let tempLogger = await Logger.findByPk(el)
      await tempLogger.destroy()
    }
  } catch (e) {
    status = statusCode['500']
  }

  switch (status) {
    case statusCode['200']:
      ctx.body = {
        status,
        mess: '删除成功~'
      }
      break
    case statusCode['500']:
      ctx.body = {
        status,
        mess: '删除失败~'
      }
  }
})


module.exports = loggerRouter
