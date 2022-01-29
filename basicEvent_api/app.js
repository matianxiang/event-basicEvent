//导入expresss
const express = require('express')
//创建服务器实例对象
const app = express()

//导入joi中间件 供下面注册全局错误级别中间件使用
const joi = require('joi')

//导入并配置 cors 中间件
const cors = require('cors')
app.use(cors())

//配置解析 application/x-www-form-urlencoded 格式的表单数据的中间件  
app.use(express.urlencoded({ extended: false }))

//在路由之前封装 res.cc 函数  响应数据的全局中间件
//客户端发起的任何请求，到达服务器之后，都会触发该中间件
app.use((req,res,next)=>{
    //status默认值1
    //err的值，可能是一个错误对象，也可能是一个错误的描述字符串
   res.cc = function(err,status = 1){
        res.send({
            status,
            //instanceof 关键字用来对比左边的对象是否属于右边的对象
            message: err instanceof Error ? err.message : err  
        })
   }
   next()
})

//一定要在路由之前配置解析 Token 的中间件
const config = require('./config')
const expressJWT = require('express-jwt')
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
//除了以/api开头的都需要进行 Token 身份验证 因为/api开头的路由还处于登陆页面 
//当用户用户名密码匹配的话服务器会发送一个token给客户端，客户端存储token,用于每次发送请求，服务端验证token过后才会返回数据，所以token的有效时间意味着过了有效时间必须重新登陆获取服务端的token
const jwtAuth = expressJWT({
     secret:config.jwtSecretKey,
     algorithms:['HS256'], //jwt更新之后，安装的express-jwt模块会默认为6.0.0版本，更新后的jwt需要在配置中加入algorithms属性，即设置jwt的算法,一般HS256为配置algorithms的默认值.
     credentialsRequired: true //false就不用验证，游客也可以访问
}).unless({path:[/^\/api\//]})
app.use(jwtAuth)

// 导入并注册用户路由模块 user.js
const userRouter = require('./router/user') 
app.use('/api', userRouter) // 使用postman测试/api/reguser 和 /api/login 是否有效
// 导入并注册用户信息的路由模块 userinfo.js
const userinfoRouter = require('./router/userinfo')
app.use('/my',userinfoRouter)//使用postman测试/my/userinfo 是否有效


//定义错误级别的全局中间件 
app.use((err,req,res,next)=>{
     // 捕获 username password 数据验证失败 
if (err instanceof joi.ValidationError) return res.cc(err)
     // 捕获 Token 身份认证失败的错误
if (err.name === 'UnauthorizedError')  return res.cc('身份认证失败！')
     //未知错误 
     res.cc(err)
})

//启动服务器
app.listen(3007,()=>{
     console.log('服务器已启动，启动端口:http://127.0.0.1:3007')
})