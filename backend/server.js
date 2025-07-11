import express from "express";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.route.js";
import { connectDB } from "./config/db.js";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.route.js";


const app = express();

const PORT = process.env.PORT || 5000;


dotenv.config();




app.use(express.json());
app.use(cors({
  origin: "https://to-do-app-00223.netlify.app", // ✅ exact Netlify URL
  credentials: true
}));

app.use("/api/todos", todoRoutes);
app.use("/api/auth", authRoutes);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log("Server started at http://localhost:5000");
});
