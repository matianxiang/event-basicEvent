//导入数据库操作模块 供后面查询用户名是否重复等操作使用
const db = require('../db/index')

//导入bcryptjs这个包 用于加密密码
const bcrypt = require('bcryptjs')

//导入生成 Token 的包
const jwt = require('jsonwebtoken')

//导入全局配置文件 config.js
const config = require('../config')

//注册新用户的处理函数
exports.regUser = (req,res) =>{
    //获取客户端提交到服务器的用户信息
    const userinfo = req.body
    //console.log(userinfo)//使用postman设置body设置username和password值发送过来

    //对表单中的数据进行合法校验 不允许为空否则报错
    // if(!userinfo.username || !userinfo.password){
    //     return res.send({status: 1,message: '用户名或密码不能为空'})
    // }

    //定义 sql 语句，查询用户名是否被占用
    const sqlStr = 'select * from ev_users where username=?'
    db.query(sqlStr,[userinfo.username],function(err,results){
    //因为这里只用一个username的占位符?所以上面也可以简写为db.query(sqlStr,userinfo.username,(err,results)=>{})
    //执行sql语句失败  
    if(err){
        //return res.send({status:1,message:err.essage})
        return res.cc(err)//app.js中间件配置的res.cc函数
    }

    //判断用户名是否被占用
    if(results.length > 0){ //大于0说明数据库中已有一样的username
        // return res.send({status:1,message:'用户名被占用，请更换其他用户名'})
        return res.cc('用户名被占用，请更换其他用户名')
    }

    //用户名可以使用 接下来调用 bcrypt.hashSync()对密码进行加密
    //console.log(userinfo) 加密前
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)
    //console.log(userinfo) 加密后

    //用户名可以使用，密码被加密，接下来定义插入新用户语句
    const sql = 'insert into ev_users set ?'
    //调用 db.query() 执行 sql 语句
    db.query(sql,{username: userinfo.username,password: userinfo.password},(err,results)=>{
     //判断 sql 语句是否执行成功
     //if(err) return res.send({status: 1,message:err.message})
     if(err) return res.cc(err)
     //判断影响的行数是否为1 是否正确插入一行数据
     if(results.affectedRows !== 1)return res.cc('用户注册失败!')
     //注册用户成功
     //res.send({status:1,message:'注册成功'})
     res.cc('注册成功',0) //注意 因为成功 status 一定要设置为0 res.cc(err,status)
    })

        })

}


//注册登录处理函数
exports.login = (req,res)=>{
    //接收表单数据
    const userinfo = req.body
    //定义 sql 语句
    const sql = `select * from ev_users where username=?`
    //执行 sql 语句，根据用户名查询用户信息
    db.query(sql,userinfo.username,(err,results)=>{
        //执行 sql 语句失败
        if(err) return res.cc('数据库查询失败'+err)
        //执行 sql 语句成功，但是获取到的数据条数不等于 1 也等于失败 0即错误
        if(results.length !== 1)return res.cc('用户名错误，登录失败')

        //判断密码是否正确  userinfo.password是登录密码 results[0].passwords是数据库存取的密码
        const compareResult = bcrypt.compareSync(userinfo.password,results[0].password)
        if(!compareResult)return res.cc('密码不正确，登录失败')

        //在服务器端生成 Token 的字符串
        //console.log(results[0]) 打印出用户信息
        const user = {...results[0],password:'',user_pic:''}//剔除用户个人信息比如密码和头像，防止泄露信息
        //对用户信息进行加密，生成一个token字符串
        const tokenStr = jwt.sign(user,config.jwtSecretKey,{ expiresIn:'10h'}) //token有效期 10h
        console.log(tokenStr)

        //调用res.send()将Token响应给客户端
        res.send({
            status: 0,
            message: '登陆成功',
            token: 'Bearer '+ tokenStr //空格不能丢 固定用法
        })
    })
}