import { Schema, model, Types, Document } from "mongoose";

interface User extends Document {
  _id: Types.ObjectId;
  firstName: string | null;
  lastName: string | null;
  username: string;
  password: string;
  age: number | null;
  description: string | null;
  email: string;
  phoneNumber: string | null;
  profilePictureId: Types.ObjectId | null;
  accommodationId: Types.ObjectId | null;
}

const userSchema = new Schema<User>(
  {
    firstName: { type: String, required: false, default: null, maxlength: 50 },
    lastName: { type: String, required: false, default: null, maxlength: 50 },
    username: { type: String, required: true, unique: true, maxlength: 50 },
    password: { type: String, required: true }, // password length is handled in the controller
    age: { type: Number, required: false, default: null, min: 0, max: 120 },
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
      maxlength: 50,
    },
    phoneNumber: {
      type: String,
      required: false,
      unique: false,
      default: null,
      maxlength: 15,
    },
    profilePictureId: {
      type: Schema.Types.ObjectId,
      ref: "File",
      default: null,
      required: false,
    },
    accommodationId: {
      type: Schema.Types.ObjectId,
      ref: "Accommodation",
      default: null,
      required: false,
    },
  },
  { timestamps: true },
);

userSchema.index(
  { phoneNumber: 1 },
  {
    unique: true,
    partialFilterExpression: { phoneNumber: { $type: "string" } },
  },
);

const UserModel = model<User>("User", userSchema);

export default UserModel;
