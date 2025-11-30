import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    user: {type: String, required: true},
    message: {type: String, required: true},
    dateCreated: {type: Date, default: Date.now},
    likes: {type: Number, default: 0}
}, {
    _id: false,
    versionKey: false,
    toJSON: {
        transform: (doc, ret) => {
            const {dateCreated,...rest} = ret;
            return {
                dateCreated: dateCreated.toISOString().slice(0, 19),
                ...rest
            }
        }
    }
})

export default commentSchema;