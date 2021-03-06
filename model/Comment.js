// 引入数据库
const mongoose = require('mongoose');
// 模型规则类
const { Schema } = mongoose;
// 对象规则验证
const Joi = require('joi');
// 文章模型规则
const CommentSchema = new Schema({
    // 评论人
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // 评论内容
    content: {
        type: String,
        minlength:1,
        maxlength: 200,
        required: true
    },
    // 评论文章
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, '评论文章不存在']
    },
    // 状态
    state: {
        type: Number,
        // 0 未批准 
        default: 0
    },
    // 评论时间
    createAt: {
        type: Date,
        default: Date.now
    }
}, {versionkey: false})

// 创建分类文章
const Comment = mongoose.model('Comment', CommentSchema);

// for(let i = 0; i < 20; i++) {
//     Comment.create({
//     author: '6274cd3ef48955cd4f2deb8c',
//     content: '我真的会蟹',
//     post: '6275e6980e186db204885dcc',
//     state: 1
// })
// }


// 文章分类格式校验(路由级别)
const validateComment = comment => {
    // _id验证规则
    const objectIdReg = /^[0-9a-fA-f]{24}$/;
    // 定义对象验证规则
    const schema = {
        author: Joi.string().regex(objectIdReg).required().error(new Error('用户id非法')),
        content: Joi.string().min(1).max(200).required().error(new Error('评论内容不能小于2个字符')),
        post: Joi.string().regex(objectIdReg).required().error(new Error('文章id非法')),
        state: Joi.number().valid(0, 1)
    }
    // 验证
    return Joi.validate(comment, schema, {
        // 检测到所有错误
        abortEarly: false,
        // 允许对象包含被忽略的未知键
        allowUnknown: true
    })
}

// 导出模块成员
module.exports = {
    Comment,
    validateComment
}