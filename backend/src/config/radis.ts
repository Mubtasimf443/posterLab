/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Redis } from 'ioredis'
import { REDIS_HOST, REDIS_URL } from './env.ts'

const redisClient = new Redis(REDIS_URL!, { tls: { servername: REDIS_HOST } })

export default redisClient 