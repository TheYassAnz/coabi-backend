import { Schema, model, Types } from 'mongoose';

interface User {
  name: string;
  surname: string;
  username: string;
  password: string;
  age: number;
  description: boolean;
  email: string;
  phone_number: string;
  accomodation_id: Types.ObjectId | null; 
};

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  description: { type: Boolean, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true },
  accomodation_id: { type: Schema.Types.ObjectId, ref: 'Accommodation', required: false }
});

const User = model<User>('User', userSchema);

export default User;