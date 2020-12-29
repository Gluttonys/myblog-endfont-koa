/*
* 标签模型
* */
const {DataTypes} = require('sequelize');
const {sequelize} = require('../utils/sequelizeInstance')

module.exports = sequelize.define(
  'tag',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }
)
