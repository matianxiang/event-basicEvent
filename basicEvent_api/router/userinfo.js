//定义用户个人信息路由
const express = require('express')

const router = express.Router()

//挂载路由


//导入路由处理函数模块
const userinfo_handler = require('../router_handler/userinfo')
//获取用户基本信息的路由
router.get('/userinfo',userinfo_handler.getUserInfo)

module.exports = router