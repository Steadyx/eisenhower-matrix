// src/models/Task.ts
import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  title: string;
  completed: boolean;
  quadrantId: string;
  selected?: boolean;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    quadrantId: {
      type: String,
      required: [true, "Quadrant ID is required"],
      enum: [
        "urgent-important",
        "not-urgent-important",
        "urgent-not-important",
        "not-urgent-not-important",
      ],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITask>("Task", TaskSchema);
