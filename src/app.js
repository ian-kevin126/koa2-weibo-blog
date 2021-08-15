const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')

const { isProd } = require('./utils/env')
const { REDIS_CONF } = require('./conf/db')

const index = require('./routes/index')
const userViewRouter = require('./routes/view/user')
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

// 配置session
app.keys = ['Uildsajda_8dsadsak&dasd_21%'] // 加密秘钥
app.use(
  session({
    key: 'weibo.sid', // cookie name 默认是 `koa.sid`
    prefix: 'weibo:sess:', // redis key 的前缀，默认是 `koa:sess:`
    cookie: {
      path: '/', // 生成的cookie在整个网站都是可用的
      httpOnly: true, // 不允许客户端修改cookie
      maxAge: 24 * 60 * 60 * 1000, // 过期时间，单位 ms
    },
    // 将session存到redis中
    // ttl: 24 * 60 * 60 * 1000, // redis的过期时间，默认是和maxAge一样的，可不写。
    store: redisStore({
      all: `${REDIS_CONF.host}:${REDIS_CONF.port}`,
    }),
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

// app.use(users.routes(), users.allowedMethods())
// app.use(users.routes(), users.allowedMethods())
app.use(userViewRouter.routes(), userViewRouter.allowedMethods())

// 404的路由一定要注册到最后，只有当所有的路由没有命中才走404
app.use(errorViewRouter.routes(), errorViewRouter.allowedMethods())
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
