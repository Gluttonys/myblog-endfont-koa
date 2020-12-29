const Router = require('koa-router')
const {defaultConfig, statusCode} = require('../config/settings')
const blogTypeLevelSecondRouter = new Router()
const blogTypeLevelSecond = require('../model/blog-type-level-2')


blogTypeLevelSecondRouter.get('/blog-type-level-one-list', async (ctx, next) => {
  await next()
  let pagingConfig = {  // 前端传过来的都是字符串形式，所以要转一下数字
    offset: ~~(ctx.query.offset) || defaultConfig.offset,
    limit: ~~(ctx.query.limit) || defaultConfig.limit
  }
  let count = 0, typeList = [], status = statusCode['200']

  try {
    typeList = await blogTypeLevelSecond.findAll(pagingConfig)
    count = await blogTypeLevelSecond.count()
  } catch (e) {
    status = statusCode['500']
  }

  switch (status) {
    case statusCode['200']:
      ctx.body = {
        count,
        typeList,
        ...pagingConfig,
        status,
      }
      break
    case statusCode['500']:
      ctx.body = {
        status,
        mess: '查询失败~'
      }
  }
})


blogTypeLevelSecondRouter.get('/find-by-pk', async (ctx, next) => {
  await next()
  let id = ~~ctx.query.id, type = {}, status = statusCode['200']
  try {
    type = await blogTypeLevelSecond.findByPk(id)
  } catch (e) {
    status = statusCode['500']
  }
  if (status === statusCode['200']) {
    ctx.body = {
      type,
      status,
      mess: type ? '查询成功！' : `不存在id为${id}的类型~`
    }
  } else {
    ctx.body = {
      status,
      mess: `查询失败~`
    }
  }
})


blogTypeLevelSecondRouter.post('/create-type', async (ctx, next) => {
  await next()
  let t, status = statusCode['200']
  try {
    t = await blogTypeLevelSecond.create(ctx.request.body)
    blogTypeLevelSecond.logger(`创建一级博客类型成功！ \r\n id : ${t.id} \r\n ${t.title}`)
  } catch (e) {
    status = statusCode['500']
  }

  switch (status) {
    case statusCode['200']:
      ctx.body = {
        status,
        type: t.dataValues
      }
      break
    case statusCode['500']:
      ctx.body = {
        status,
        mess: '创建用户失败~'
      }
  }
})


blogTypeLevelSecondRouter.post('/update-by-id', async (ctx, next) => {
  await next()
  let id = ~~ctx.request.body.id, status = statusCode['200'], t
  try {
    t = await blogTypeLevelSecond.findByPk(id)
  } catch (e) {
    status = statusCode['500']
  }

  switch (status) {
    case statusCode['200']:
      if (!t) {
        ctx.body = {
          status: statusCode['400'],
          mess: `id为${id}的类型不存在`
        }
        return
      } else {
        if (delete ctx.request.body.id) {
          await blogTypeLevelSecond.update(ctx.request.body, {where: {id}})
          ctx.body = {
            status,
            type: await blogTypeLevelSecond.findByPk(id),
            mess: '更新成功~'
          }
        } else {
          ctx.body = {
            status,
            mess: '更新失败~'
          }
        }
      }
      break
    case statusCode['500']:
      ctx.body = {
        status,
        mess: '更新失败~'
      }
      return
  }
})


blogTypeLevelSecondRouter.get('/del-by-id', async (ctx, next) => {
  await next()
  let id = ctx.query.id, status = statusCode['200']
  id = id.includes(',') ? id.split(',').map(el => ~~el) : [~~id]

  try {
    for (const el of id) {
      let tempType = await blogTypeLevelSecond.findByPk(el)
      await tempType.destroy()
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


module.exports = blogTypeLevelSecondRouter
