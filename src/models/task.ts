import { Schema, model, Types, Document } from 'mongoose';

interface Task extends Document {
  name: string;
  description: string;
  weekly: boolean;
  done: boolean;
  user_id: Types.ObjectId;
  accommodation_id: Types.ObjectId; 
};

const taskSchema = new Schema<Task>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  weekly: { type: Boolean, required: true },
  done: { type: Boolean, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true  },
  accommodation_id: { type: Schema.Types.ObjectId, ref: 'Accommodation', required: true }
});

const TaskModel = model<Task>('Task', taskSchema);

export default TaskModel;
