import * as postRepo from '../repositories/post.repository.js'

function ThrowErrorPostNotFound(id){
    const error = new Error(`Post with id ${id} not found`)
    error.statusCode = 404
    throw error
}

class PostService {
    async createPost(author, data) {
        return await postRepo.createPost({...data, author});
    }

    async getPostById(id) {
        const post = await postRepo.getPostById(id)
        if(!post) ThrowErrorPostNotFound(id)
        return post
    }

    async addLike(postId) {
        const updated = await postRepo.addLike(postId)
        if(!updated) ThrowErrorPostNotFound(postId)
        return updated
    }

    async getPostsByAuthor(author) {
        return postRepo.getPostsByAuthor(author);
    }

    async addComment(postId, commenter, message) {
        const post = await postRepo.getPostById(postId)
        if(!post) ThrowErrorPostNotFound(postId)
        const comment = {user: commenter, message}
        return await postRepo.addComment(postId, comment)
    }

    async deletePost(postId) {
        const post = await postRepo.deletePost(postId)
        if(!post) ThrowErrorPostNotFound(postId)
        return post
    }

    async findPostsByTags(tagsString) {
        const tagsArray = tagsString.split(',')
        return await postRepo.findPostsByTags(tagsArray);
    }

    async findPostsByPeriod(dateFrom, dateTo) {
        const query = {}
        if (dateFrom) query.$gte = new Date(dateFrom)
        if (dateTo) {
            const dateEndOfDay = new Date(dateTo)
            dateEndOfDay.setHours(23,59,59,999)
            query.$lte = new Date(dateEndOfDay)
        }
        return await postRepo.findPostsByPeriod(query)
    }

    async updatePost(postId, data) {
        const postUpdated = await postRepo.updatePost(postId, data)
        if(!postUpdated) ThrowErrorPostNotFound(postId)
        return postUpdated
    }
}

export default new PostService()