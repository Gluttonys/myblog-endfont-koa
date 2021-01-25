/*
* blog 表
* */

const {DataTypes} = require('sequelize');
const {sequelize} = require('../utils/sequelizeInstance')

const Blog = module.exports = sequelize.define(
  'Blog',
  {
    title: {         // 文章标题
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {          // 文章描述
      type: DataTypes.STRING,
    },
    is_del: {        // 是否删除
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_reprint: {    // 是否转载
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_top: {        // 是否置顶
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_boutique: {   // 是否精品
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    content: {       // 文章内容
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    freezeTableName: true, // 强制表名称等于模型名称
  }
)

