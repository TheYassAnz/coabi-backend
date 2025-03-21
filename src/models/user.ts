import { Schema, model, Types } from 'mongoose';

interface User {
  name: string;
  surname: string;
  username: string;
  password: string;
  age: number;
  description: string;
  email: string;
  phone_number: string;
  profile_picture_id: Types.ObjectId | null;
  accommodation_id: Types.ObjectId | null; 
};

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  description: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true },
  profile_picture_id: { type: Schema.Types.ObjectId, ref: 'File', required: false },
  accommodation_id: { type: Schema.Types.ObjectId, ref: 'Accommodation', required: false }
});

const User = model<User>('User', userSchema);

export default User;