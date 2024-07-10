import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
configDotenv();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL,credentials:true }));

// configuring app middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// configuring routes
app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/user", require("./routes/user"));


app.listen(4000, () => {
  console.log("Server is listenig on port 4000");
});
