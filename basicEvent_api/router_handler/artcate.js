//文章类别路由处理函数模块


//导入数据库操作模块
const db = require('../db/index')


// 获取文章分类列表数据的处理函数
exports.getArticleCates = (req, res) => {
    //1 定义查询分类列表数据的sql语句 筛选出 is_deleted=0 即未被删除的数据
    const sql = `select * from ev_article_cate where is_delete=0 order by id asc`
    //2 调用db.query()执行sql语句
    db.query(sql, (err, results) => {
        // 1. 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 2. 执行 SQL 语句成功
        res.send({
            status: 0,
            message: '获取文章分类列表成功！',
            data: results,
        })
    })
}

//新增文章分类的处理函数
exports.addArticleCates= (req,res) =>{
    // 1定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
const sql = `select * from ev_article_cate where name=? or alias=?`

    // 2执行查重操作
db.query(sql, [req.body.name, req.body.alias], (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 判断 分类名称 和 分类别名 是否都被占用 两种情况
    if (results.length === 2) return res.cc('分类名称与别名分别被不同的分类占用，请更换后重试！')
    if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('已存在相同分类名称和别名的分类，请更换后重试！')
    // 分别判断 分类名称 和 分类别名 是否被占用 两种情况
    if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
    if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
  
    // 3 数据验证没有问题 执行新增文章分类
    // 3.1 定义文章分类的sql语句
    const sql2 = `insert into ev_article_cate set ?`
    // 3.2 执行插入文章分类的sql语句
    db.query(sql2, req.body, (err, results) => {
        // SQL 语句执行失败
        if (err) return res.cc(err)
        // SQL 语句执行成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('新增文章分类失败！')
        // 新增文章分类成功
        res.cc('新增文章分类成功！', 0)
      })
  })
}

//删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
    // 1 定义删除文章分类的 SQL 语句
    const sql = `update ev_article_cate set is_delete=1 where id=?`
    
    // 2 调用db.query()执行删除文章分类的 SQL 语句
    db.query(sql, req.params.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
      
        // SQL 语句执行成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败！')
      
        // 删除文章分类成功 status: 0 
        res.cc('删除文章分类成功！,已将其is_deleted属性设置为1', 0)
      })

    
}


// 根据 Id 获取文章分类的处理函数
exports.getArticleById = (req, res) => {
     //1 定义根据 Id 获取文章分类的 SQL 语句
    const sql = `select * from ev_article_cate where id=?`

     //2 调用 db.query() 执行 SQL 语句
     db.query(sql, req.params.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
      
        // SQL 语句执行成功，但是没有查询到任何数据
        if (results.length !== 1) return res.cc('获取文章分类数据失败！')
      
        // 把数据响应给客户端
        res.send({
          status: 0,
          message: '获取文章分类数据成功！',
          data: results[0],
        })
      })
}


// 更新文章分类的处理函数
exports.updateCateById = (req, res) => {
    // 1 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
const sql = `select * from ev_article_cate where Id<>? and (name=? or alias=?)`
    
    // 2 执行查重操作
db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
  
    // 判断 分类名称 和 分类别名 是否被占用
    if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
    if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
    if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
  
    // 3 更新文章分类
    const sql1 = `update ev_article_cate set ? where Id=?`
    db.query(sql1, [req.body, req.body.Id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
      
        // SQL 语句执行成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('更新文章分类失败！')
      
        // 更新文章分类成功
        res.cc('更新文章分类成功！', 0)
      })
  })  
}