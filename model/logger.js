const {DataTypes} = require('sequelize');
const {sequelize} = require('../utils/sequelizeInstance')

module.exports = sequelize.define(
  'logger',
  {
    log_content: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }
)

