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
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    description: { type: String, required: false, default: null },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
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
