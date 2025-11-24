import * as postRepo from '../repositories/post.repository.js'

class PostService {
    async createPost(author, data) {
        return await postRepo.createPost({...data, author});
    }

    async getPostById(id) {
        return await postRepo.getPostById(id);
    }

    async addLike(postID) {
        // TODO add like to post
        throw new Error('Not implemented')
    }

    async getPostsByAuthor(author) {
        // TODO get posts by author
        throw new Error('Not implemented')
    }

    async addComment(postId, commenter, message) {
        // TODO add comment to post
        throw new Error('Not implemented')
    }

    async deletePost(postId) {
        // TODO delete post
        throw new Error('Not implemented')
    }

    async findPostsByTags(tagsString) {
        // TODO find post by tags. Tags example: python,java,j2ee
        throw new Error('Not implemented')
    }

    async findPostsByPeriod(dateFrom, dateTo) {
        // TODO find post by period. Date format: YYYY-MM-DD
        throw new Error('Not implemented')
    }

    async updatePost(postId, data) {
        // TODO update post. Data example:
        //      "title": "Jakarta EE",
        //     "tags":["Jakarta EE", "J2EE"],
        //     "content": "Java is the best for backend"
        throw new Error('Not implemented')
    }
}

export default new PostService()