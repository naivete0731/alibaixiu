// 文章模块
const { Post } =require('../../../model/Post');

module.exports = async (req, res) => {
    try {
        // 获取用户输入的额关键字
            const key = req.params.key;
            // 如果用户输入了关键字
            if(key.trim().length > 0) {
                const regex = new RegExp(escapeRegex(key), 'gi');
                // 根据关键字查询文章
                const posts = await Post.find({title: regex}).populate('author', '-password').populate('category');
                // 响应
                res.send(posts);
            } else {
                res.status(400).send({message: '请输入搜索关键字'})
            }
    } catch(ex) {
        next(ex)
    }
   
}




function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}