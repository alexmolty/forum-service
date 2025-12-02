import Post from '../models/post.js';

export function createPost(post) {
    return Post.create(post)
}

export function getPostById(id) {
    return Post.findById(id)
}

export function deletePost(id) {
    return Post.findByIdAndDelete(id)
}

export function addLike(id) {
    return Post.findByIdAndUpdate(id, {$inc: {likes: 1}})
}

export function getPostsByAuthor(author) {
    return Post.find({author: new RegExp(`^${author}$`, 'i')})
}

export function addComment(id, comment) {
    return Post.findByIdAndUpdate(id, {$push: {comments: comment}}, {new: true})
}

export function findPostsByTags(tags) {
    const tagsIgnoreCase = tags.map(tag => new RegExp(`^${tag}$`, 'i'))
    return Post.find({tags: {$in: tagsIgnoreCase}})
}

export function findPostsByPeriod(query) {
    return Post.find({
        dateCreated: query
    })
}

export function updatePost(id, data) {
    return Post.findByIdAndUpdate(id, data, {new: true})
}