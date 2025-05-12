import { Schema, model, Types, Document } from "mongoose";

export enum FileTypes {
  IMAGE = "image",
  PDF = "pdf",
}

interface File extends Document {
  _id: string;
  name: string;
  description: string | null;
  type: FileTypes;
  size: number;
  userId: Types.ObjectId;
  accommodationId: Types.ObjectId;
}

const fileSchema = new Schema<File>(
  {
    _id: { type: String, required: true, maxlength: 50 },
    name: { type: String, required: true, maxlength: 50 },
    description: {
      type: String,
      required: false,
      default: null,
      maxlength: 100,
    },
    type: { type: String, enum: Object.values(FileTypes), required: true },
    size: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    accommodationId: {
      type: Schema.Types.ObjectId,
      ref: "Accommodation",
      required: true,
    },
  },
  { timestamps: true },
);

const FileModel = model<File>("File", fileSchema);

export { FileModel };
