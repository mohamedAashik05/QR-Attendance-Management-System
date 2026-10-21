import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    student_ID: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    students_name: {
      type: String,
      required: true,
      trim: true,
    },
    email_ID: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone_no: {
      type: Number,
      required: true,
    },
    course_ID: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Student = mongoose.model("Student", studentSchema);
