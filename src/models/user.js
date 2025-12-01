import {Schema, Types, model} from 'mongoose';

const userSchema = new Schema({
    _id: {type: String, required: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    roles: {type: [String], default: ["USER"], enum: ["USER", "ADMIN", "MODERATOR"]}
}, {
    versionKey: false,
    toJSON: {
        transform: (doc, ret) => {
            const {_id, password, ...rest} = ret;
            return {
                login: _id,
                ...rest
            }
        }
    }
})
const user = model('User', userSchema, 'users');
export default user;