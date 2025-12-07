import {Schema, Types, model} from 'mongoose';
import bcrypt from 'bcrypt'
import {ALL_ROLES, USER} from "../config/constants.js";
const userSchema = new Schema({
    _id: {type: String, required: true, alias: 'login'},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    roles: {type: [String], default: [USER], enum: ALL_ROLES}
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
// mongoose middleware
userSchema.pre('save', async function (next) {
    if(this.isModified('password')) {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
    }
})
userSchema.methods.comparePassword = async function (plainTextPassword) {
    return await bcrypt.compare(plainTextPassword, this.password);
}

const user = model('User', userSchema, 'users');
export default user;