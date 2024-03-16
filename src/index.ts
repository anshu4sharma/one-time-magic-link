import express from "express";
import { connectDB } from "./config/data.config";
import { errorHandler } from "./middewares/error.handler";
import UserRouter from "./router/User";
async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;
  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });
  app.use("/api", UserRouter);

  // this will handle all the error !! 
  //  we will through all error to this middleware !!
  app.use(errorHandler);

  app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
}

connectDB();

init();

