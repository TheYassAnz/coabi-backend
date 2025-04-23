import { Schema, model, Types, Document } from "mongoose";

interface Task extends Document {
  name: string;
  description: string | null;
  weekly: boolean;
  done: boolean;
  userId: Types.ObjectId;
  accommodationId: Types.ObjectId;
}

const taskSchema = new Schema<Task>(
  {
    name: { type: String, required: true },
    description: { type: String, required: false, default: null },
    weekly: { type: Boolean, required: true },
    done: { type: Boolean, required: false, default: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    accommodationId: {
      type: Schema.Types.ObjectId,
      ref: "Accommodation",
      required: true,
    },
  },
  { timestamps: true },
);

const TaskModel = model<Task>("Task", taskSchema);

export default TaskModel;
