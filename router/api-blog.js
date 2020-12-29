const Router = require('koa-router')
const blogRouter = new Router()
const {defaultConfig, statusCode} = require('../config/settings')
const Blog = require('../model/blog')

// https://www.showdoc.com.cn/1198970017278877?page_id=6055994636509743
blogRouter.get('/blog-list', async (ctx, next) => {
  await next()
  let pagingConfig = {
    offset: ~~(ctx.query.offset) || defaultConfig.offset,
    limit: ~~(ctx.query.limit) || defaultConfig.limit
  }
  let count = 0, blogList = [], status = statusCode['200']
  try {
    blogList = await Blog.findAll({...defaultConfig})
    count = await Blog.count()
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
      blogList,
      ...pagingConfig,
      status,
    }
  }
})


// https://www.showdoc.com.cn/1198970017278877?page_id=6055995509735524
blogRouter.get('/find-by-pk', async (ctx, next) => {
  await next()
  let id = ~~ctx.query.id, blog = {}, status= statusCode['200']
  try {
    blog = await Blog.findByPk(id)
  } catch (e) {
    status = statusCode['500']
  }
  if (status === statusCode['200']) {
    ctx.body = {
      blog,
      status,
      mess: blog ? '查询成功！': `不存在id为${id}的博客~`
    }
  } else {
    ctx.body = {
      status,
      mess: `查询失败~`
    }
  }
})


// https://www.showdoc.com.cn/1198970017278877?page_id=6055995745233418
blogRouter.post('/create-blog', async (ctx, next) => {
  await next()
  let blog, status = statusCode['200']
  try {
    blog = await Blog.create(ctx.request.body)
  } catch (e) {
    status = statusCode['500']
  }

  switch (status) {
    case statusCode['200']:
      ctx.body = {
        status,
        blog: blog.dataValues
      }
      break
    case statusCode['500']:
      ctx.body = {
        status,
        mess: '创建博客失败'
      }
  }
})


// https://www.showdoc.com.cn/1198970017278877?page_id=6055996463470210
blogRouter.post('/update-by-id', async (ctx, next) => {
  await next()
  let id = ~~ctx.request.body.id, status= statusCode['200'], b
  try {
    b = await Blog.findByPk(id)
  } catch (e) {
    status = statusCode['500']
  }

  switch (status) {
    case statusCode['200']:
      if (!b) {
        ctx.body = {
          status:statusCode['400'],
          mess: `id为${id}的博客不存在`
        }
        return
      } else {
        if (delete ctx.request.body.id) {
          await Blog.update(ctx.request.body, {where: {id}})
          ctx.body = {
            status,
            blog: await Blog.findByPk(id),
            mess: '更新成功~'
          }
        } else {
          ctx.body = {
            status,
            mess: '更新失败~'
          }
        }
        return
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

module.exports = blogRouter
