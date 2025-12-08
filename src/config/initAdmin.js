import {ALL_ROLES} from "./constants.js";
import User from "../models/user.js";

export async function createAdmin() {
    let admin = await User.findById('admin')
    if(!admin){
        admin = new User({
            login: 'admin',
            password: 'admin',
            firstName: 'Adminis',
            lastName: 'Trator',
            roles: ALL_ROLES
        })
        await admin.save();
    }
}