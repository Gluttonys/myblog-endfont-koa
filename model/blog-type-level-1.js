/*
* 博客分类
*   一级分类
*
* */

const {DataTypes} = require('sequelize')
const {sequelize} = require('../utils/sequelizeInstance')

module.exports = sequelize.define(
  'blog-type-level-1',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
  }
)


