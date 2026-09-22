import "dotenv/config";
import express from "express";
import cors from "cors";
import Studentsrouter from "./routes/studentsroutes.js";
import Attendancerouter from "./routes/attendanceroutes.js";
import TrainerAuthRouter from "./routes/trainerAuthRoute.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use(Studentsrouter);
app.use(Attendancerouter);
app.use(TrainerAuthRouter);

const PORT = Number(process.env.PORT || 5000);

app.listen(PORT, () => {
  console.log(`QR Attendance API is running on ${PORT}`);
});