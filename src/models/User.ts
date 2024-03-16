import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import ApiError from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { IUser } from "../@types";
import { SALT_ROUND } from "../constants/env";
import { generateHash } from "../utils/hashing";

const Schema = mongoose.Schema;

export const UserSchema = new Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, min: 5, require: true },
});

// we have to hash the password saving it !!

UserSchema.pre("save", function (next) {
  const password = this.password as string;
  this.password = generateHash(password);
  next();
});

export const comparePassword = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
};

const User = mongoose.model("User", UserSchema);

export default User;
