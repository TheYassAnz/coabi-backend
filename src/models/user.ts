import { Schema, model, Types, Document } from "mongoose";

interface User extends Document {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  age: number;
  description: string | null;
  email: string;
  phoneNumber: string;
  profilePictureId: Types.ObjectId | null;
  accommodationId: Types.ObjectId | null;
}

const userSchema = new Schema<User>(
  {
    firstName: { type: String, required: true, maxlength: 50 },
    lastName: { type: String, required: true, maxlength: 50 },
    username: { type: String, required: true, unique: true, maxlength: 50 },
    password: { type: String, required: true },
    age: { type: Number, required: true, min: 0, max: 120 },
    description: {
      type: String,
      required: false,
      default: null,
      maxlength: 500,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
    },
    phoneNumber: { type: String, required: true, unique: true, maxlength: 15 },
    profilePictureId: {
      type: Schema.Types.ObjectId,
      ref: "File",
      required: false,
    },
    accommodationId: {
      type: Schema.Types.ObjectId,
      ref: "Accommodation",
      required: false,
    },
  },
  { timestamps: true },
);

const UserModel = model<User>("User", userSchema);

export default UserModel;
