import "dotenv/config"

export const NODE_ENV  = process.env.NODE_ENV

export const JWT_SECRET  = process.env.JWT_SECRET as string

export const SALT_ROUND =  process.env.SALT_ROUND;
