const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const { isProd } = require('./utils/env')

const index = require('./routes/index')
const users = require('./routes/users')
const errorViewRouter = require('./routes/view/error')

// error handler
let onerrorConf = {}
// 线上环境下跳出一个错误页，开发环境就直接报错，直接调试
if (isProd) {
  onerrorConf = {
    redirect: '/error',
  }
}
onerror(app, onerrorConf)

// middlewares，解析post提交form格式的文本
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text'],
  })
)
// bodyparser解析post请求后，如果是json格式的，就需要通过这个中间件处理成对象形式的数据
app.use(json())
// 日志中间件
app.use(logger())
// 将public下面的静态文件css，js，images当做一个静态资源来访问
// 我们可以在浏览器输入 http://localhost:3000/stylesheets/style.css 访问到静态资源
app.use(require('koa-static')(__dirname + '/public'))

// 注册 ejs
app.use(
  views(__dirname + '/views', {
    extension: 'ejs',
  })
)

// logger，跟上面的logger有点重复，是一个中间件演示，可以注释掉
// app.use(async (ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date() - start
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })

// routes

app.use(users.routes(), users.allowedMethods())
app.use(users.routes(), users.allowedMethods())
// 404的路由一定要注册到最后，只有当所有的路由没有命中才走404
app.use(errorViewRouter.routes(), errorViewRouter.allowedMethods())
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
