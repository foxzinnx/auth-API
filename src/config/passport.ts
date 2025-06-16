import passport from "passport";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import dotenv from 'dotenv';
import { User, UserInstance } from "../models/User";
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";

dotenv.config();

const notAuthorized = {status: 401, message: 'Não autorizado!'};

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY as string
}

passport.use(new JWTStrategy(opts, async (payload, done) => {
    try {
        const user = await User.findByPk(payload.id);
        if(!user){
            return done(null, false, notAuthorized)
        }

        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));

export const generateToken = (data: object) => {
    return jwt.sign(data, process.env.JWT_SECRET_KEY as string, {expiresIn: '1h'});
}

export const privateRoute = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false}, (err: any, user: UserInstance | Error) => {
        if(err){
            return next(err);
        }
        
        if(!user){
            return next(notAuthorized);
        }
        req.user = user;
        next()
    })(req, res, next);
}

export default passport;