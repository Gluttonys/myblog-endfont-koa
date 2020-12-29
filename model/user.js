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
      type: DataTypes.STRING,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
  }
)
