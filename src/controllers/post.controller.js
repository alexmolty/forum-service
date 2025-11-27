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
            return res.json(posts)
        } catch (error) {
            return next(error)
        }
    }

    async deletePost(req, res, next) {
        try {
            const post = await postService.deletePost(req.params.id)
            return res.json(post)
        } catch (error) {
            return next(error)
        }
    }

    async addLike(req, res, next) {
        try {
            await postService.addLike(req.params.id)
            return res.sendStatus(204)
        } catch (error) {
            return next(error)
        }
    }

    async findPostsByAuthor(req, res, next) {
        try {
            const posts = await postService.getPostsByAuthor(req.params.author)
            return res.json(posts)
        } catch (error) {
            return next(error)
        }
    }

    async addComment(req, res, next) {
        try {
            const comment = await postService.addComment(req.params.id, req.params.commenter, req.body.message)
            return res.json(comment)
        } catch (error) {
            return next(error)
        }
    }

    async findPostsByTags(req, res, next) {
        try {
            const posts = await postService.findPostsByTags(req.query.values)
            return res.json(posts)
        } catch (error) {
            return next(error)
        }
    }

    async findPostsByPeriod(req, res, next) {
        try {
            const posts = await postService.findPostsByPeriod(req.query.dateFrom, req.query.dateTo)
            return res.json(posts)
        } catch (error) {
            return next(error)
        }
    }

    async updatePost(req, res, next) {
        try {
            const postUpdated = await postService.updatePost(req.params.id, req.body)
            return res.json(postUpdated)
        } catch (error) {
            return next(error)
        }
    }
}

export default new PostController()