const Sequelize = require('sequelize')
const { MYSQL_CONF } = require('../conf/db')
const { isProd, isTest } = require('../utils/env')

const { host, user, password, database } = MYSQL_CONF

const conf = {
  host,
  dialect: 'mysql',
}

// 如果是单元测试，就不需要打印SQL语句了，帮助我们快速知道错误发生在哪里
if (isTest) {
  conf.logging = () => {}
}

// 线上环境使用连接池
if (isProd) {
  conf.pool = {
    max: 5, // 连接池中最大的连接数量
    min: 0, // 连接池中最小的连接数量
    idle: 10000, // 如果一个连接10s内没有被使用，则释放
  }
}

const seq = new Sequelize(database, user, password, conf)

// 测试连接
seq
  .authenticate()
  .then(() => {
    console.log('ok')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = seq
