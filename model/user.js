/*
* user 表
* */
const {DataTypes} = require('sequelize');
const {sequelize} = require('../utils/sequelizeInstance')

module.exports = sequelize.define(
  'User',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Gluttony'
    },
    desc: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    platform: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  },
  {
    freezeTableName: true,
  }
)
