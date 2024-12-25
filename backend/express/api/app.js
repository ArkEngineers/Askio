import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { authRouter, classRouter, groupRouter, quizRouter } from "./routes/Routes.js";


const app = express();
dotenv.config({
  path: "./.env",
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERR: ", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MONGO DB Connection Failed !", err);
  });

//routes import
// import Router from "./routes/routes.js"

// routes declaration
app.get("/", (req, res) => {
  res.send("Hello, this is the root route!");
});

// app.use(compression());

app.use("/api/v1/auth", authRouter); // <- NEW LINE
app.use("/api/v1/quiz", quizRouter); 
app.use("/api/v1/group", groupRouter); 
app.use("/api/v1/class", classRouter); 

export default app;
