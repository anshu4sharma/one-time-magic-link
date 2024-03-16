import bcrypt from "bcryptjs";
import { SALT_ROUND } from "../constants/env";

export const generateHash = (input: string) => {
  var salt = bcrypt.genSaltSync(Number(SALT_ROUND));
  return bcrypt.hashSync(input, salt);
};
