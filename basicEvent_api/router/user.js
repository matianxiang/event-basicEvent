//定义登陆注册路由
const express = require('express')
const router = express.Router()

//导入用户路由处理函数对应的模块
const userHandler = require('../router_handler/user')

//对username和password进行验证
//1导入验证数据中间件
const expressJoi = require('@escook/express-joi')
//2导入需要验证的规则对象
const{reg_login_schema} = require('../schema/user')

//注册新用户 注册和登陆使用同一个验证中间件，因为都需要提交用户名和密码
router.post('/reguser',expressJoi(reg_login_schema),userHandler.regUser)
//调用上面定义的验证数据中间件，验证成功则调用userHandler.regUser函数

//登录
router.post('/login',expressJoi(reg_login_schema),userHandler.login)

module.exports = router