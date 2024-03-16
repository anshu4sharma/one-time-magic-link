import mongoose from "mongoose";

export const connectDB = () => {
  try {
    mongoose
      .connect("mongodb://127.0.0.1:27017/onetimeresetpassword")
      .then(() => {
        console.log("db is connected !");
      });
  } catch (error) {
    console.log("Failed to connect DB !!");
    process.exit(1);
  }
};
