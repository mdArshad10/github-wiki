import Redis from 'ioredis'
import { env } from './env';

class RedisService{
    public static redisInstance:Redis
    constructor(){

    }

    public static getInstance(){
        return this.getInstance;
    }

    public static async connection(){
        const instance = this.redisInstance;
        if(!instance){
            this.redisInstance = new Redis(env.REDIS_URL)
        }
    }
}