//1 导入定义验证规则的模块
const joi = require('joi')

//2 定义验证规则

//定义 name 和 alias 的验证规则
const name = joi.string().required()
const alias = joi.string().alphanum().required()
// 定义 分类Id 的校验规则
const id = joi.number().integer().min(1).required()


//3 向外共享验证规则的对象
//校验规则对象 - 新增分类
exports.add_cate_schema = {
     body:{
         name: name,
         alias: alias
     }
}

// 校验规则对象 - 根据id删除分类
exports.delete_cate_schema = {
    params: {
      id,
    },
  }

// 校验规则对象 - 根据 Id 获取分类
exports.get_cate_schema = {
    params: {
      id,
    },
  }

// 校验规则对象 - 更新分类
exports.update_cate_schema = {
    body: {
      Id: id,
      name: name,
      alias: alias,
    },
  }