// 验证模块
const Joi = require('joi');
// 分类模型
const { Category } = require('../../../model/Category');

module.exports = async (req, res) => {
    try {
    // 获取用户id
        const id = req.params['id'];
        // 验证模块
        const schema = Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).error(new Error('分类id非法'))
        // 验证
        const { error } = Joi.validate(id, schema);
        // 如果验证没有通过
        if (error) return res.status(400).send({message: error.message})
        // 通过验证
        // 查询用户信息
        const category = await Category.findById(id);
        // 响应
        return res.send(category);
    } catch(ex) {
        next(ex)
    }
    
}