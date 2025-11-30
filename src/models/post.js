import {Schema, Types, model} from 'mongoose';
import commentSchema from "./comment.js";

const postSchema = new Schema({
    _id: { type: String, default: () => new Types.ObjectId().toHexString()},
    title: {type: String, required: true},
    content: {type: String, required: true},
    author: {type: String, required: true},
    dateCreated: {type: Date, default: Date.now},
    tags: {type: [String], default: []},
    likes: {type: Number, default: 0},
    comments: {
        type: [commentSchema],
        default: []
    }
}, {
    versionKey: false,
    toJSON: {
        transform: (doc, ret) => {
            const {_id, dateCreated,...rest} = ret;
            return {
                id: _id,
                dateCreated: dateCreated.toISOString().slice(0, 19),
                ...rest
            }
        }
    }
})
const Post = model('Post', postSchema, 'posts');
export default Post;