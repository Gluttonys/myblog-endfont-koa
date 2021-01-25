/*
* 数据库出口
* 此文件关联 app.js 文件
* 创建所有表
* */
const {Model} = require('sequelize')
const {sequelize} = require('../utils/sequelizeInstance')
const Types = require('../utils/Types')

const Logger = require('./logger')  // 日志表
const Blog = require('./blog')      // 博客表
const User = require('./user')      // 用户表
const BlogTypeLevel1 = require('./blog-type-level-1')  // 博客一级分类
const BlogTypeLevel2 = require('./blog-type-level-2')  // 博客二级分类
const Tag = require('./tag')        // 标签表


// 全局写日志方法 content : 日志内容
Model.logger = async function (log_content) {
  if (Types.isString(log_content) && log_content.trim()) {
    log_content = `${Date.now()}   ${log_content}`
    await Logger.create({log_content})
  }
}


/* Blog n ---> n User  多对多  */
Blog.belongsToMany(User, {through: 'BlogUsers'})
User.belongsToMany(Blog, {through: 'BlogUsers'})

/* BlogTypeLevel1 1 ---> n BlogTypeLevel2  一对多  */
BlogTypeLevel1.hasMany(BlogTypeLevel2, {onDelete: 'CASCADE', onUpdate: 'NO ACTION'})
BlogTypeLevel2.belongsTo(BlogTypeLevel1)

/* BlogTypeLevel2 1 ---> n Blog  一对多  */
BlogTypeLevel2.hasMany(Blog, {onDelete: 'CASCADE', onUpdate: 'NO ACTION'})
Blog.belongsTo(BlogTypeLevel2)

/* Blog n ---> n Tag   多对多 */
Blog.belongsToMany(Tag, { through: 'BlogTags' })
Tag.belongsToMany(Blog, { through: 'BlogTags' })

// 同步所有模型
;(async function () {
  await sequelize.sync({
    alter: true
  }).catch(console.log)
})()

// User.sync() - 如果表不存在,则创建该表(如果已经存在,则不执行任何操作)
// User.sync({ force: true }) - 将创建表,如果表已经存在,则将其首先删除
// User.sync({ alter: true }) - 这将检查数据库中表的当前状态(它具有哪些列,它们的数据类型等),然后在表中进行必要的更改以使其与模型匹配.
