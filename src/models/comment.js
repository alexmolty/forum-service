import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    postId: {type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true},
    user: {type: String, required: true},
    message: {type: String, required: true},
    dateCreated: {type: Date, default: Date.now},
    likes: {type: Number, default: 0}
}, {
    versionKey: false, toJSON: {
        transform: (doc, ret) => {
            const {_id, postId, ...rest} = ret;
            return {...rest}
        }
    }
})

const Comment = mongoose.model('Comment', commentSchema, 'comments');
export default Comment