// 文章模型
const { Post , validatePost } = require('../../../model/Post')
// 验证模块
const Joi = require('joi');
module.exports = async (req, res) => {
    try {
        // 获取用户id
            const id = req.params['id'];
            // console.log(id);
            // 验证模型
            const schema = Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).error(new Error('文章id非法'))
            // 验证
            const { error } = Joi.validate(id, schema);
            // 数据格式没有通过验证
            if (error) return res.status(400).send({message: error.message})
            // 通过验证
            // 查询文章信息
            const post = await Post.findOne({_id: id}).populate('author', '-password').populate('category')
            
                // 增加文章阅读数量
                post.meta.views = post.meta.views + 1;
                // 保存
                await post.save();
            
            // 响应
            return res.send(post);
    } catch(ex) {
        next(ex)
    }
   
}