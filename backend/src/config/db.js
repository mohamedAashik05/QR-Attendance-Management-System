import "dotenv/config";
import dns from "node:dns";
import mongoose from "mongoose";

// Use Google public DNS to prevent ISP DNS timeouts on SRV lookups (_mongodb._tcp)
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import { Student } from "../models/Student.js";
import { Trainer } from "../models/Trainer.js";
import { Attendance } from "../models/Attendance.js";
import { getNextSequence } from "../models/Counter.js";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
}

export async function NewRegisterOrUpdate(data) {
  // If student_ID is provided, try to update existing student
  if (data.student_ID) {
    const existing = await Student.findOneAndUpdate(
      { student_ID: Number(data.student_ID) },
      {
        students_name: data.students_name,
        email_ID: data.email_ID,
        phone_no: Number(data.phone_no),
        course_ID: Number(data.course_ID),
      },
      { new: true }
    );

    if (existing) {
      return {
        output: { newStudentID: existing.student_ID },
        recordset: [existing],
      };
    }
  }

  // Check if student with same email already exists
  if (data.email_ID) {
    const byEmail = await Student.findOne({
      email_ID: data.email_ID.trim().toLowerCase(),
    });

    if (byEmail) {
      byEmail.students_name = data.students_name;
      byEmail.phone_no = Number(data.phone_no);
      byEmail.course_ID = Number(data.course_ID);
      await byEmail.save();
      return {
        output: { newStudentID: byEmail.student_ID },
        recordset: [byEmail],
      };
    }
  }

  // Register new student with an auto-incremented student ID
  const newStudentID = await getNextSequence("student_ID");
  const newStudent = await Student.create({
    student_ID: newStudentID,
    students_name: data.students_name,
    email_ID: data.email_ID,
    phone_no: Number(data.phone_no),
    course_ID: Number(data.course_ID),
  });

  return {
    output: { newStudentID: newStudent.student_ID },
    recordset: [newStudent],
  };
}

export async function USP_AttendanceDetails(data) {
  const attendance = await Attendance.create({
    student_ID: Number(data.student_ID),
    checkin_time: data.checkin_time,
    trainer: data.trainer || null,
  });

  return attendance;
}

export async function USP_GetStudentDetails(id) {
  const student = await Student.findOne({ student_ID: Number(id) });
  return student ? { recordset: [student] } : { recordset: [] };
}

export async function USP_Trainer_SignUP(TrainerDetails) {
  const existing = await Trainer.findOne({
    Email_ID: TrainerDetails.Email_ID.trim().toLowerCase(),
  });

  if (existing) {
    const error = new Error("Trainer with this email already exists");
    error.code = 11000;
    throw error;
  }

  const newTrainerID = await getNextSequence("trainer_ID");
  const newTrainer = await Trainer.create({
    trainer_ID: newTrainerID,
    TrainerName: TrainerDetails.TrainerName,
    Email_ID: TrainerDetails.Email_ID,
    Password: TrainerDetails.Password,
    CourseID: Number(TrainerDetails.CourseID),
    JoinDate: TrainerDetails.JoinDate || new Date(),
  });

  return {
    output: { newTrainerID: newTrainer.trainer_ID },
    recordset: [newTrainer],
  };
}

export async function GetTrainerByEmail(email) {
  if (!email) return null;
  const trainer = await Trainer.findOne({
    Email_ID: new RegExp(`^${email.trim()}$`, "i"),
  });

  if (!trainer) return null;

  return {
    trainer_ID: trainer.trainer_ID,
    email: trainer.Email_ID,
    Password: trainer.Password,
  };
}