/*
* 实例化一个全局的 sequelize 对象
* https://www.sequelize.com.cn/core-concepts/getting-started
* */

const {Sequelize} = require('sequelize')
const {mysqlConfig, eventTitle} = require('../config/settings')
const channel = require('../event-channel')

const sequelize = new Sequelize(
  mysqlConfig.database,
  mysqlConfig.user,
  mysqlConfig.password,
  {
    host: mysqlConfig.host,
    dialect: mysqlConfig.title
  }
)


/*
* @title : testConnection()
* @desc : test the connection
* @param : null
* @return : Boolean
* */
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.')
    return true
  } catch (error) {
    channel.emit(eventTitle.mysqlConnectionFail, error)
    return false
  }
}

function closeSequelize() {
  /*
  * 默认情况下,Sequelize 将保持连接打开状态,并对所有查询使用相同的连接.
  * 如果你需要关闭连接,请调用 sequelize.close()(这是异步的并返回一个 Promise).
  * */
  return sequelize.close()
}

module.exports = {
  sequelize,
  testConnection,
  closeSequelize
}
