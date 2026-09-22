import "dotenv/config";
import bcrypt from "bcrypt";
import { Router } from "express";
import jwt from 'jsonwebtoken';
import { GetTrainerByEmail, USP_Trainer_SignUP } from '../config/db.js';

const router = Router();
const SecretKey = process.env.JWT_SECRET;

if (!SecretKey) {
  throw new Error("JWT_SECRET is required");
}

export const VerifyQrToken = (req, res, next) => {
  const token = req.body.qrToken || req.query.qrToken;
  if (!token) return res.status(401).json({ message: "QR token is required" });

  try {
    const verified = jwt.verify(token, SecretKey);
    if (verified.type !== "attendance-qr") {
      return res.status(401).json({ message: "Invalid QR token" });
    }
    req.qr = verified;
    next();
  } catch {
    return res.status(401).json({ message: "QR code expired or invalid" });
  }
};

const VerifyToken = (req, res, next) => {
  const AuthHeader = req.headers.authorization
  console.log(AuthHeader)
  if(!AuthHeader) return res.status(401).send("Authorization header missing")
  const token = AuthHeader.split(" ")[1]
  if(!token) return res.status(401).send("unauthorized user")
  try{
    const verified = jwt.verify(token,SecretKey)
    req.user = verified
    next()
  }
  catch(err){
    res.status(401).send("Invalid token")
  }
}

router.post("/api/register/trainer", async (req, res) => {
  try {
    const TrainerDetails = req.body;

    // Validate required fields
    if (!TrainerDetails.TrainerName || !TrainerDetails.Password || !TrainerDetails.Email_ID || !TrainerDetails.CourseID || !TrainerDetails.JoinDate) {
      return res.status(400).json({ message: "Every field is required" });
    }

    const hashedPassword = await bcrypt.hash(TrainerDetails.Password, 10);
    TrainerDetails.Password = hashedPassword
    console.log(TrainerDetails)
    const result = await USP_Trainer_SignUP(TrainerDetails)
    console.log("Signup request received");
    return res.status(201).json({ message: "User account created successfully" });

  } 
  catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/api/login/trainer", async (req, res) => {
  try {
    const Email_ID = req.body.Email_ID?.trim();
    const Password = req.body.Password;
    
    // Validate required fields
    if (!Email_ID || !Password) {
      return res.status(400).json({ message: "Email_ID and Password are required" });
    }

    const User = await GetTrainerByEmail(Email_ID)
    if (!User) return res.status(401).json({ message: "Invalid email or password" })

    const validatePassword = await bcrypt.compare(Password, User.Password)
    if (!validatePassword) return res.status(401).json({ message: "Invalid email or password" })

    const token = jwt.sign({ Email_ID: User.email }, SecretKey, { expiresIn: "1h" })
    res.json({ "token": token })
  }
  catch (err) {
    console.error("Trainer login failed:", err)
    res.status(500).json({ message: "Unable to log in trainer" })
  }
})

router.get("/api/trainer/qr", VerifyToken, (req, res) => {
  const expiresAt = Date.now() + 20 * 60 * 1000;
  const token = jwt.sign(
    { type: "attendance-qr", trainer: req.user.Email_ID },
    SecretKey,
    { expiresIn: "20m" },
  );

  res.set("Cache-Control", "no-store");
  return res.json({ token, expiresAt });
});

router.get("/api/profile", VerifyToken, (req, res) => {
  res.send(`welcome ${req.user.userName}`)
})

export default router;