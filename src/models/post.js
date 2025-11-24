import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    author: {type: String, required: true},
    dateCreated: {type: Date, default: Date.now},
    tags: {type: [String]},
    likes: {type: Number, default: 0},
    comments: {type: [String], default: []}
}, {
    versionKey: false,
    toJSON: {
        transform: (doc, ret) => {
            const {_id, ...rest} = ret;
            return {id: _id, ...rest}
        }
    }
})
const Post = mongoose.model('Post', postSchema, 'posts');
export default Post;