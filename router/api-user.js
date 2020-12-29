const Router = require('koa-router')
const {defaultConfig, statusCode} = require('../config/settings')
const Types = require('../utils/Types')
const userRouter = new Router()
const User = require('../model/user')

// https://www.showdoc.com.cn/1198970017278877?page_id=6055956287743654
userRouter.get('/user-list', async (ctx, next) => {
  await next()
  let pagingConfig = {  // 前端传过来的都是字符串形式，所以要转一下数字
    offset: ~~(ctx.query.offset) || defaultConfig.offset,
    limit: ~~(ctx.query.limit) || defaultConfig.limit
  }
  let count = 0, userList = [], status = statusCode['200']

  try {
    userList = await User.findAll({...defaultConfig})
    count = await User.count()
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
      userList,
      ...pagingConfig,
      status,
    }
  }
})


// https://www.showdoc.com.cn/1198970017278877?page_id=6055962744442303
userRouter.get('/find-by-pk', async (ctx, next) => {
  await next()
  let id = ~~ctx.query.id, user = {}, status= statusCode['200']
  try {
    user = await User.findByPk(id)
  } catch (e) {
    status = statusCode['500']
  }
  if (status === statusCode['200']) {
    ctx.body = {
      user,
      status,
      mess: user ? '查询成功！': `不存在id为${id}的用户~`
    }
  } else {
    ctx.body = {
      status,
      mess: `查询失败~`
    }
  }
})

// https://www.showdoc.com.cn/1198970017278877?page_id=6055960603443863
userRouter.post('/create-user', async (ctx, next) => {
  await next()
  let u, status = statusCode['200']
  try {
    u = await User.create(ctx.request.body)
    User.logger(`创建用户成功！ \r\n id : ${u.id} \r\n ${u.name}`)
  } catch (e) {
    status = statusCode['500']
  }

  switch (status) {
    case statusCode['200']:
      ctx.body = {
        status,
        user: u.dataValues
      }
      break
    case statusCode['500']:
      ctx.body = {
        status,
        mess: '创建用户失败~'
      }
  }
})


// https://www.showdoc.com.cn/1198970017278877?page_id=6055967958707991
userRouter.post('/update-by-id', async (ctx, next) => {
  await next()
  let id = ~~ctx.request.body.id, status= statusCode['200'], u
  try {
    u = await User.findByPk(id)
  } catch (e) {
    status = statusCode['500']
  }

  switch (status) {
    case statusCode['200']:
      if (!u) {
        ctx.body = {
          status:statusCode['400'],
          mess: `id为${id}的用户不存在`
        }
        return
      } else {
        if (delete ctx.request.body.id) {
          await User.update(ctx.request.body, {where: {id}})
          ctx.body = {
            status,
            user: await User.findByPk(id),
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


userRouter.get('/del-by-id', async (ctx, next) => {
  await next()
  /*
  * id : 可以传以下两种形式，
  *   1 ： 删除指定id的用户
  *   "1, 2, 3, 4" ： 删除所有指定id的用户（必须以 逗号 分隔）
  * */
  let id = ctx.query.id, status= statusCode['200']
  id = id.includes(',') ? id.split(',').map(el => ~~el) : [~~id]

  try {
    id.forEach(async el => {
      let tempUser = await User.findByPk(el)
      await tempUser.destroy()
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


module.exports = userRouter
