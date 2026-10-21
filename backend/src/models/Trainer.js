import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema(
  {
    trainer_ID: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    TrainerName: {
      type: String,
      required: true,
      trim: true,
    },
    Email_ID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    Password: {
      type: String,
      required: true,
    },
    CourseID: {
      type: Number,
      required: true,
    },
    JoinDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Trainer = mongoose.model("Trainer", trainerSchema);
