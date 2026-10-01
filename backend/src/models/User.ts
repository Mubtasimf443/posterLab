/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { model, Schema } from "mongoose";

export interface IUser {
    name : string;
    email : string;
    passwordHash : string;
    role : 'user' | 'admin';
    createdAt : Date;
    isVerified : boolean
}

const userSchema = new Schema<IUser>({
    name : {
        type: String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        index : true
    },
    passwordHash : {
        type : String,
        required : true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt : {
        type :Date,
        required : true,
        default : Date.now
    },
    isVerified : {
        type : Boolean,
        default : false,
        required : true
    }
});


const User = model<IUser>('User', userSchema);

export default User;