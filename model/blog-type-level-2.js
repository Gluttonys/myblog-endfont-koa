/*
* 博客分类
*   二级分类
*
* */

const {DataTypes} = require('sequelize')
const {sequelize} = require('../utils/sequelizeInstance')

module.exports = sequelize.define(
  'blog-type-level-2',
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
