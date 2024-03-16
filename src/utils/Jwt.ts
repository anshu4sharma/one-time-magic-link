import { IUser, TJWT_TOKEN } from "../@types";
import jwt from "jsonwebtoken";

export const verifyJWT = (token: string, JWT_SECRET: string) => {
  return jwt.verify(token, JWT_SECRET) as TJWT_TOKEN;
};

export const generateJWT = (user: IUser, JWT_SECRET: string) => {
  const { _id, email, name } = user;
  // jwt will expire in 2mintues
  return jwt.sign({ _id, email, name }, JWT_SECRET, { expiresIn: 60 * 2 });
};
