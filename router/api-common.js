const Router = require('koa-router')
const {defaultConfig, statusCode} = require('../config/settings')
const {responseBody} = require('../utils')

const commonRouter = new Router()
const blogTypeLevelTop = require('../model/blog-type-level-1')
const blogTypeLevelSecond = require('../model/blog-type-level-2')


commonRouter.get('/blog-types', async (ctx, next) => {
  await next()
  let result = null

  try {
    let tempTypeLevel1 = await blogTypeLevelTop.findAll({attributes: ['id', 'title']})
    result = tempTypeLevel1.map(({dataValues}) => dataValues)
    for(type of result) {
      let tempTypeLevel2 = await blogTypeLevelSecond.findAll({
        attributes: ['id', 'title'],
        where: {blogTypeLevel1Id: type.id}
      })
      type.children = tempTypeLevel2.map(({dataValues}) => dataValues)
    }
  } catch (e) {
    blogTypeLevelTop.logger('查询博客分类出错~ api-common.js line-25 ')
    ctx.body = responseBody(statusCode['500'], 'error')
    return
  }
  ctx.body = responseBody(statusCode['200'], 'success', result)
})


module.exports = commonRouter
