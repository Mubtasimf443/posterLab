/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import type { Request, Response } from "express";
import { loginSchema, registrationSchema, verificationTokenSchema } from "../utils/zod-schema/auth.schema.ts";
import User from "../models/User.ts";
import crypto from 'crypto'
import redisClient from "../config/radis.ts";
import { sendRegistrationVerificationEmail } from "../utils/mails/auth.mails.ts";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { JWT_SECRET, NODE_ENV } from "../config/env.ts";

export default class authService {
    static async Register(req : Request , res : Response) {
        try {
            let { data: validationResult , error} = registrationSchema.safeParse(req.body);
            if (error || !validationResult) {
                return res.status(200).json({ error, success: false, data: null });
            }
            let existingUser = await User.findOne({ email: validationResult.email });

            if (existingUser  ) {
                if (existingUser.isVerified) {
                    return res.status(403).json({ error: { message: 'You arleady have an account, please Login' }, success: false, data: null });
                } else {
                    let token = crypto.randomBytes(48).toString('hex').normalize();
                    let isTokenStored = await redisClient.set(`auth_verification_token:${token}`, JSON.stringify({ userID: existingUser._id }), 'EX', 100);
                    if (isTokenStored !== 'OK') {
                        return res.status(500).json({ error: { messsage: "Redis Client failed to store session"}, data : null , success : false });
                    }
                    await sendRegistrationVerificationEmail({ name: existingUser.name, to: existingUser.email, token });
                    return res.status(200).json({ success : true, data : null , error : null});
                }
            }
            let salt = bcrypt.genSaltSync(12);
            let passwordHash = bcrypt.hashSync(validationResult.password, salt);
            let user =await User.create({
                name :validationResult.name,
                email : validationResult.email,
                passwordHash ,
                isVerified : false
            });
            let token = crypto.randomBytes(48).toString('hex').normalize();
            let isTokenStored = await redisClient.set(`auth_verification_token:${token}`, JSON.stringify({ userID: user._id }), 'EX', 100);
            if (isTokenStored !== 'OK') {
                return res.status(500).json({ error: { messsage: "Redis Client failed to store session" }, data: null, success: false });
            }
            await sendRegistrationVerificationEmail({ name: user.name, to: user.email, token });
            return res.status(200).json({ success: true, data : null , error : null })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, success: false, data: null })
        }
    }
    static async RegistrationVerification(req : Request , res : Response) {
        try {
            let token = verificationTokenSchema.parse(req.params.token);
            let jsonedUserInfo = await redisClient.get(`auth_verification_token:${token}`);
            if (jsonedUserInfo === null) {
                return res.status(400).json({ error: { message: 'please register again' }, data: null, success: false });
            }
            let {userID}= JSON.parse(jsonedUserInfo);
            await User.findByIdAndUpdate(userID, { isVerified: true });
            return res.status(200).json({ success: true, error: null, data: null });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, success: false, data: null })
        }
    }
    static async Login(req : Request , res : Response) {
        try {
            let { error, data: validationResult } = loginSchema.safeParse(req.body);
            if (error || !validationResult) {
                return res.status(400).json({ error, data: null, success: false });
            }
            let user = await User.findOne({ email: validationResult.email, isVerified: true, role : 'user' });
            if (!user) {
                return res.status(403).json({ error: { message: 'invalid credentials' }, data: null, success: false });
            }
            let isPasswordEqual = bcrypt.compareSync(validationResult.password , user.passwordHash);
            if (!isPasswordEqual) {
                return res.status(400).json({ error: { message: 'Invalid credentials' }, data: null, success: false });
            }

            let jwtToken = jwt.sign({ userID: user._id} , JWT_SECRET!, { expiresIn : '7d'});
            return res
                .status(200)
                .cookie('login_session', jwtToken, {
                    httpOnly : true,
                    sameSite : NODE_ENV === 'production' ? 'none' : 'lax',
                    secure : NODE_ENV === 'production' ? true : false,
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
                .json({ success: true, data: null, error: null });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, success: false, data: null })
        }
    }

    static async AdminLogin(req : Request, res : Response ) {
        try {
            let { error, data: validationResult } = loginSchema.safeParse(req.body);
            if (error || !validationResult) {
                return res.status(400).json({ error, data: null, success: false });
            }
            let user = await User.findOne({ email: validationResult.email, isVerified: true, role : 'admin' });
            if (!user) {
                return res.status(403).json({ error: { message: 'invalid credentials' }, data: null, success: false });
            }
            let isPasswordEqual = bcrypt.compareSync(validationResult.password , user.passwordHash);
            if (!isPasswordEqual) {
                return res.status(400).json({ error: { message: 'Invalid credentials' }, data: null, success: false });
            }

            let jwtToken = jwt.sign({ adminId: user._id} , JWT_SECRET!, { expiresIn : '7d'});
            return res
                .status(200)
                .cookie('admin_login_session', jwtToken, {
                    httpOnly : true,
                    sameSite : NODE_ENV === 'production' ? 'none' : 'lax',
                    secure : NODE_ENV === 'production' ? true : false,
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
                .json({ success: true, data: null, error: null });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, success: false, data: null })
        }
    }

    static async UserDetails(req : Request, res : Response ) {
        try {
            let userId = req.user_id;
            let user = await User.findById(userId, 'name email _id');
            if (!user) {
                return res.status(401).json({ error: { message: 'No User found from the email id:' + userId }, data: null, success: false });
            }
            return res.status(200).json({ data: { user }, success: true, error: null });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, success: false, data: null })
        }
    }

    static async isAdmin(req : Request, res : Response ) {
        try {
            let admin_id= req.admin_id;
            return res.status(200).json({ admin_id });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, success: false, data: null })
        }
    }
}