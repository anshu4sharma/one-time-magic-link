import { Response, Request } from "express";
import {
  FORGOT_PASSWORD_VALIDATION,
  LOGIN_VALIDATION,
  RESET_PASSWORD_BODY,
  RESET_PASSWORD_PARAMS,
  SIGNUP_VALIDATION,
} from "../validation/User.validation";
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import User, { comparePassword } from "../models/User";
import ApiError from "../utils/ApiError";
import { IUser } from "../@types";
import { Types } from "mongoose";
import { JWT_SECRET } from "../constants/env";
import { generateJWT, verifyJWT } from "../utils/Jwt";
import { generateHash } from "../utils/hashing";

export interface CustomRequest extends Request {
  id?: string; // Assuming id is a string
}

export default class UserController {
  static forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = FORGOT_PASSWORD_VALIDATION.parse(req.body);
    const isExist = await User.findOne({ email });
    if (!isExist) {
      throw new ApiError(400, "User not found !");
    } else {
      const token = generateJWT(
        isExist as unknown as IUser,
        JWT_SECRET + isExist.password
      );
      const link = `http://localhost:8000/api/reset-password/${isExist.id}/${token}`;
      res
        .status(200)
        .json(
          new ApiResponse(
            "Reset Password Link has been generated ",
            { link },
            200
          )
        );
    }
  });
// link wull be valid for one use only ! we have also set jwt expiration time to 2 minutes after 2 minute the link will be no longer valid !
  static resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { password } = RESET_PASSWORD_BODY.parse(req.body);
    const { id, token } = RESET_PASSWORD_PARAMS.parse(req.params);
    // const isValid = comparePassword(password, isExist.password as string);
    const isExist = await User.findById(new Types.ObjectId(id));
    if (!isExist) {
      throw new ApiError(404, "User not found !");
    } else {
      const isValidToken = verifyJWT(token, JWT_SECRET + isExist.password);
      const newPassword = generateHash(password);
      await User.findOneAndUpdate(
        {
          email: isValidToken.email,
        },
        {
          $set: {
            password: newPassword,
          },
        }
      );
      return res
        .status(200)
        .json(
          new ApiResponse(
            "Your password has been succesfully reseted !",
            null,
            200
          )
        );
    }
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = LOGIN_VALIDATION.parse(req.body);
    const isExist = await User.findOne({ email });
    if (!isExist) {
      throw new ApiError(404, "User not found !");
    } else {
      const isValid = comparePassword(password, isExist.password as string);
      const token = generateJWT(isExist as unknown as IUser, JWT_SECRET);
      if (isValid && token) {
        return res
          .status(200)
          .json(new ApiResponse("Login success", { token }, 200));
      }
      throw new ApiError(400, "Invalid Credentials !!");
    }
  });

  static signup = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name } = SIGNUP_VALIDATION.parse(req.body);
    // we have to hash the password saving it !!'
    const isExist = await User.findOne({ email });
    if (isExist) {
      throw new ApiError(400, "User already exist !");
    } else {
      await User.create({
        email,
        password,
        name,
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            "You have been successfully sign up !",
            { email, password, name },
            200
          )
        );
    }
  });
  static userDetails = asyncHandler(
    async (req: CustomRequest, res: Response) => {
      // we have to hash the password saving it !!'
      const isExist = await User.findById(
        new Types.ObjectId(req?.id as string)
      ).select("-password");
      // console.log(isExist,"asdsa");
      if (!isExist) {
        throw new ApiError(400, "User not found !");
      }
      return res
        .status(200)
        .json(
          new ApiResponse("You have been successfully sign up !", isExist, 200)
        );
    }
  );
}
