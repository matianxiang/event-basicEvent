//文章的处理函数模块
const path = require('path')
const db = require('../db/index')

//获取文章列表处理函数
exports.getArticleLists = (req,res)=>{
    //1 定义查询分类列表数据的sql语句 筛选出 is_deleted=0 即未被删除的数据
    const sql = `select * from ev_articles where is_deleted=0 order by id asc`
    //2 调用db.query()执行sql语句
    db.query(sql, (err, results) => {
        // 1. 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 2. 执行 SQL 语句成功
        res.send({
            status: 0,
            message: '获取文章列表成功！',
            data: results,
        })
    })
}


// 发布新文章的处理函数
exports.addArticle = (req, res) => {
    // 1 手动判断是否上传了文章封面
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')

    //2 表单数据合理，执行发布功能
    //2.1 整理要插入数据库的文章信息对象：
    const articleInfo = {
        // 标题、内容、状态、所属的分类Id
        ...req.body,
        // 文章封面在服务器端的存放路径
        cover_img: path.join('/uploads', req.file.filename),
        // 文章发布时间
        pub_date: new Date(),
        // 文章作者的Id
        author_id: req.user.id,
    }
    //2.2 定义发布文章的 SQL 语句
    const sql = `insert into ev_articles set ?`
    //2.3 调用db.query()执行发布文章的 SQL 语句
    // 执行 SQL 语句
    db.query(sql, articleInfo, (err, results) => {
       // 执行 SQL 语句失败
       if (err) return res.cc(err)
       // 执行 SQL 语句成功，但是影响行数不等于 1
       if (results.affectedRows !== 1) return res.cc('发布文章失败！')
       // 发布文章成功
       res.cc('发布文章成功', 0)
    })
}