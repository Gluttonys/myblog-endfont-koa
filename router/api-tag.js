const Router = require('koa-router')
const {defaultConfig, statusCode} = require('../config/settings')

const tagRouter = new Router()
const Tag = require('../model/tag')


tagRouter.get('/tag-list', async (ctx, next) => {
  await next()
  let pagingConfig = {  // 前端传过来的都是字符串形式，所以要转一下数字
    offset: ~~(ctx.query.offset) || defaultConfig.offset,
    limit: ~~(ctx.query.limit) || defaultConfig.limit
  }
  let count = 0, tagList = [], status = statusCode['200']

  try {
    tagList = await Tag.findAll(pagingConfig)
    count = await Tag.count()
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
      tagList,
      ...pagingConfig,
      status,
    }
  }
})


tagRouter.get('/find-by-pk', async (ctx, next) => {
  await next()
  let id = ~~ctx.query.id, tag = {}, status= statusCode['200']
  try {
    tag = await Tag.findByPk(id)
  } catch (e) {
    status = statusCode['500']
  }
  if (status === statusCode['200']) {
    ctx.body = {
      tag,
      status,
      mess: tag ? '查询成功！': `不存在id为${id}的tag~`
    }
  } else {
    ctx.body = {
      status,
      mess: `查询失败~`
    }
  }
})


tagRouter.post('/create-tag', async (ctx, next) => {
  await next()
  let t, status = statusCode['200']
  try {
    t = await Tag.create(ctx.request.body)
    Tag.logger(`创建用户成功！ \r\n id : ${t.id} \r\n ${t.name}`)
  } catch (e) {
    status = statusCode['500']
  }

  switch (status) {
    case statusCode['200']:
      ctx.body = {
        status,
        tag: t.dataValues
      }
      break
    case statusCode['500']:
      ctx.body = {
        status,
        mess: '创建用户失败~'
      }
  }
})


tagRouter.post('/update-by-id', async (ctx, next) => {
  await next()
  let id = ~~ctx.request.body.id, status= statusCode['200'], t
  try {
    t = await Tag.findByPk(id)
  } catch (e) {
    status = statusCode['500']
  }

  switch (status) {
    case statusCode['200']:
      if (!t) {
        ctx.body = {
          status:statusCode['400'],
          mess: `id为${id}的标签不存在`
        }
        return
      } else {
        if (delete ctx.request.body.id) {
          await Tag.update(ctx.request.body, {where: {id}})
          ctx.body = {
            status,
            tag: await Tag.findByPk(id),
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


tagRouter.get('/del-by-id', async (ctx, next) => {
  await next()
  let id = ctx.query.id, status= statusCode['200']
  id = id.includes(',') ? id.split(',').map(el => ~~el) : [~~id]

  try {
    id.forEach(async el => {
      let tempTag = await Tag.findByPk(el)
      await tempTag.destroy()
    })
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


module.exports = tagRouter


