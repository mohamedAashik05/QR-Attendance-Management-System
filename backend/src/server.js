import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import Studentsrouter from "./routes/studentsroutes.js";
import Attendancerouter from "./routes/attendanceroutes.js";
import TrainerAuthRouter from "./routes/trainerAuthRoute.js";

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint for cloud deployment platforms
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "QR Attendance API is running" });
});

app.use(Studentsrouter);
app.use(Attendancerouter);
app.use(TrainerAuthRouter);

const PORT = Number(process.env.PORT || 5000);

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`QR Attendance API is running on http://localhost:${PORT}`);
  });
}

startServer();