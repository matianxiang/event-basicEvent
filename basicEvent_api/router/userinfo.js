//定义用户个人信息路由
const express = require('express')

const router = express.Router()


//挂载路由


//导入路由处理函数模块
const userinfo_handler = require('../router_handler/userinfo')

//导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
//导入需要验证的规则对象 一个是更新用户信息 一个是重置密码 一个是重置头像
const {update_userinfo_schema,update_password_schema,update_avatar_schema} = require('../schema/user')

//获取用户基本信息的路由 /my/userinfo
router.get('/userinfo',userinfo_handler.getUserInfo)
//更新用户信息的路由 1 配置验证数据的中间件 2 信息合理后更新用户信息  /my/userinfo
router.post('/userinfo',expressJoi(update_userinfo_schema),userinfo_handler.updateUserinfo)
//更新密码路由 1 配置验证新密码的中间件 2 新密码合理后重置密码 /my/updatepwd
router.post('/updatepwd',expressJoi(update_password_schema),userinfo_handler.updatePassword)
//更换头像的路由 /my/update/avatar
router.post('/update/avatar',expressJoi(update_avatar_schema),userinfo_handler.updateAvatar)


module.exports = router