//用户信息验证规则模块

//导入定义验证规则的模块
const { expression } = require('joi')
const joi = require('joi')

//定义用户名和密码、以及id nickname email的验证规则
/**
 * string() 值必须是字符串
 * intefer() 值必须是整数
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 * email() 必须是邮箱
 */
// 用户名的验证规则
const username = joi.string().alphanum().min(1).max(10).required()
// 密码的验证规则
const password = joi.string().pattern(/^[\S]{6,12}$/).required()//正则内容：长度在6-12之间 不可以包含空白字符

// 注册和登录表单的验证规则对象
exports.reg_login_schema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    username,//用户名验证
    password,//密码验证
  }
  //本项目不需要对req.query和req.params验证
//   query: {
//       name,
//       age,
//   },
//   params:{
//       id
//   }
}


// 定义 id, nickname, emial 的验证规则
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()

// 验证规则对象 - 更新用户基本信息
exports.update_userinfo_schema = {
  //只需对req.body里面的属性进行验证
  body: {
    id: id,
    nickname: nickname,
    email: email,
  },
}

// 验证规则对象 - 重置密码
exports.update_password_schema = {
  body: {
    oldPwd: password,
    //直接使用上面定义过的 password 这个规则，验证 req.body.oldPwd 的值
    newPwd: joi.not(joi.ref('oldPwd')).concat(password),
    // 使用 joi.not(joi.ref('oldPwd')).concat(password) 规则，验证 req.body.newPwd 的值
    // 解读：
    // 1. joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
    // 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
    // 3. .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
  },
}

//定义验证 avatar 头像的验证的规则
const avatar = joi.string().dataUri().required()
//验证规则对象 - 重置头像
exports.update_avatar_schema = {
   body:{
     avatar: avatar
   }
}