import * as postRepo from '../repositories/post.repository.js'
import {HttpError} from "../config/HttpError.js";

class PostService {
    async createPost(author, data) {
        if(data.tags) {
            const tagsLowerCase = data.tags.map(t => t.toLowerCase())
            data.tags = tagsLowerCase
        }
        return await postRepo.createPost({...data, author});
    }

    async getPostById(id) {
        const post = await postRepo.getPostById(id)
        if(!post) throw new HttpError(`Post with id ${id} not found`, 404)
        return post
    }

    async addLike(postId) {
        const updated = await postRepo.addLike(postId)
        if(!updated) throw new HttpError(`Post with id ${postId} not found`, 404)
        return updated
    }

    async getPostsByAuthor(author) {
        return postRepo.getPostsByAuthor(author);
    }

    async addComment(postId, commenter, message) {
        const post = await postRepo.getPostById(postId)
        if(!post) throw new HttpError(`Post with id ${postId} not found`, 404)
        const comment = {user: commenter, message}
        return await postRepo.addComment(postId, comment)
    }

    async deletePost(postId) {
        const post = await postRepo.deletePost(postId)
        if(!post) throw new HttpError(`Post with id ${postId} not found`, 404)
        return post
    }

    async findPostsByTags(tags) {
        if(typeof tags === 'string'){
            tags = tags.split(',')
        }
        tags = tags.map(t => t.toLowerCase())
        return await postRepo.findPostsByTags(tags);
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
        const post = await postRepo.getPostById(postId)
        if(!post) throw new HttpError(`Post with id ${postId} not found`, 404)
        const updateData = { ...data };
        if(data.tags) {
            const existing = post.tags.map(t => t.toLowerCase())
            const incoming = data.tags.map(t => t.toLowerCase())
            const merged = new Set([...existing, ...incoming]);
            updateData.tags = [...merged];
        }
        return await postRepo.updatePost(postId, updateData)
    }
}

export default new PostService()