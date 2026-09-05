import type{Request,Response,NextFunction} from 'express'
import { fromNodeHeaders } from "better-auth/node";
import { auth } from '../config/auth';

export const authMiddleware = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        if(!session){
           return next(new Error("unauthorized"))
        }
        req.session = session?.session;
        req.user = session?.user;
        next()
    } catch (error) {
        next(error)
    }
}