import postService from "../services/post.service.js";

class PostController {
    async createPost(req, res, next) {
        try {
            const post = await postService.createPost(req.params.author, req.body)
            return res.status(201).json(post)
        } catch (error) {
            return next(error)
        }
    }

    async getPostById(req, res, next) {
        try {
            const posts = await postService.getPostById(req.params.id)
            if (!posts) return next(res.status(404))
            return res.status(200).json(posts)
        } catch (error) {
            return next(error)
        }
    }
}

export default new PostController()