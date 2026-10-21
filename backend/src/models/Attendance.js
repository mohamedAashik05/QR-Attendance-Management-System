import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student_ID: {
      type: Number,
      required: true,
      index: true,
    },
    checkin_time: {
      type: String,
      required: true,
    },
    trainer: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Attendance = mongoose.model("Attendance", attendanceSchema);
