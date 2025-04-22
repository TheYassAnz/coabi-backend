import { Schema, model, Types, Document } from "mongoose";

interface User extends Document {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  age: number;
  description: string | null;
  email: string;
  phone_number: string;
  profile_picture_id: Types.ObjectId | null;
  accommodation_id: Types.ObjectId | null;
}

const userSchema = new Schema<User>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  description: { type: String, required: false, default: null },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true },
  profile_picture_id: {
    type: Schema.Types.ObjectId,
    ref: "File",
    required: false,
  },
  accommodation_id: {
    type: Schema.Types.ObjectId,
    ref: "Accommodation",
    required: false,
  },
});

const UserModel = model<User>("User", userSchema);

export default UserModel;
