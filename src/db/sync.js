/**
 * @description sequelize 同步数据库
 */

const seq = require('./seq')

require('./model/index')

// 测试连接
seq
  .authenticate()
  .then(() => {
    console.log('auth ok')
  })
  .catch(() => {
    console.log('auth err')
  })

// 执行同步，force为true的意思是每次同步会把之前的数据清掉
seq.sync({ force: true }).then(() => {
  console.log('sync ok')
  process.exit()
})
