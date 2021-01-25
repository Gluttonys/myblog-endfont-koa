const Router = require('koa-router')
const blogRouter = new Router()
const {defaultConfig, statusCode} = require('../config/settings')

const Blog = require('../model/blog')
const User = require('../model/user')
const Tag = require('../model/tag')

const {responseBody} = require('../utils')
const types = require('../utils/Types')

// https://www.showdoc.com.cn/1198970017278877?page_id=6055994636509743
blogRouter.get('/blog-list', async (ctx, next) => {
  await next()
  let pagingConfig = {
    offset: ~~(ctx.query.offset) || defaultConfig.offset,
    limit: ~~(ctx.query.limit) || defaultConfig.limit
  }
  let count = 0, blogList = [], status = statusCode['200']
  try {
    blogList = await Blog.findAll(pagingConfig)
    count = await Blog.count()
  } catch (e) {
    status = statusCode['500']
  }

  switch (status) {
    case statusCode['200']:
      ctx.body = responseBody(status, '查询成功~', blogList, {count, ...pagingConfig})
      break
    case statusCode['500']:
      ctx.body = responseBody(status, '查询失败~')
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
  const {userListValue, tagListValue} = ctx.request.body
  try {
    blog = await Blog.create(ctx.request.body)
    console.log(userListValue, tagListValue)
    // 处理 作者和标签
    let awaitToAddUsers = userListValue.filter(el => types.isNumber(el))
    blog.setUsers(awaitToAddUsers)
    for (let el of userListValue) {   // 创建新用户~
      if (types.isString(el)) {
        let u = await User.create({name: el, desc: '很神秘的人~', avatar: '', platform: ''})
        u.addBlog(blog)
      }
    }

    let awaitToAddTags = tagListValue.filter(el => types.isNumber(el))
    blog.setTags(awaitToAddTags)
    for (let el of tagListValue) {    // 创建新标签 ~
      if (types.isString(el)) {
        let t = await Tag.create({name: el})
        t.addBlog(blog)
      }
    }
  } catch (e) {
    status = statusCode['500']
    Blog.logger('服务器出错， 创建博客失败~')
  }

  switch (status) {
    case statusCode['200']:
      ctx.body = responseBody(status, '创建博客成功~', blog.dataValues)
      break
    case statusCode['500']:
      ctx.body = responseBody(status, '创建博客失败~')
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
        ctx.body = responseBody(statusCode['400'], `id为${id}的博客不存在`)
      } else {
        if (delete ctx.request.body.id) {
          await Blog.update(ctx.request.body, {where: {id}})
          ctx.body = responseBody(status, '更新成功~', await Blog.findByPk(id))
        } else {
          ctx.body = responseBody(status, '更新失败~')
        }
      }
      break
    case statusCode['500']:
      ctx.body = responseBody(status, '服务器错误, 更新博客失败~')
  }
})


// https://www.showdoc.com.cn/1198970017278877?page_id=6066682891027863
blogRouter.get('/del-by-id', async (ctx, next) => {
  await next()

  let id = ctx.query.id, status= statusCode['200']
  id = id.includes(',') ? id.split(',').map(el => ~~el) : [~~id]

  try {
    id.forEach(async el => {
      let tempBlog = await Blog.findByPk(el)
      Blog.logger(`成功删除博客~ \r\n id: ${tempBlog.id} \r\n title: ${tempBlog.title}`)
      await tempBlog.destroy()
    })
  } catch (e) {
    status = statusCode['500']
  }

  switch (status) {
    case statusCode['200']:
      ctx.body = responseBody(status, '删除成功~')
      break
    case statusCode['500']:
      ctx.body = responseBody(status, '删除失败~')
  }
})


module.exports = blogRouter
