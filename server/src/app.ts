import express, {type Request,type Response,type NextFunction} from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import {errorMiddleware} from "@/shared/middlewares/error-middleware";
import taskRouter from "@/services/task/routes/task.routes";
import { ApiResponse } from "@/shared/utils/api-response";
import { pingDatabase } from "@/shared/config/database";
import { toNodeHandler } from "better-auth/node";
import { auth } from "@/shared/config/auth";
import { serve } from "inngest/express";
import { inngest } from "@/inngest/index";
import { functions } from "@/inngest/functions/index";

const app = express();
const corsOrigin:string[] = ['http://localhost:5173'];


app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json({limit:"2mb"}));
app.use(express.urlencoded({extended:true,limit:"2mb"}))
app.use(helmet())
app.use(morgan("dev"))
app.use(cors({
    origin:corsOrigin,
    methods:["GET",'PUT','POST','DELETE','PATCH'],
}))

app.use("/api/v1/tasks", taskRouter);
app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/health", async (req:Request,res:Response,next:NextFunction)=>{
    const databaseStatus = (await pingDatabase()).state;
    
    const healthcheck = {
        databaseStatus,
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now()
    };
    res.status(200).json(ApiResponse.success(healthcheck,200,'health of project'))
    
});
app.use((req:Request,res:Response)=>{
    res.status(404).json(ApiResponse.error(null,404,`Route not found: ${req.method} ${req.originalUrl}`));
});
app.use(errorMiddleware);

export {app}
