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
}

const fileSchema = new Schema<File>(
  {
    _id: { type: String, required: true },
    description: { type: String, required: false, default: null },
    type: { type: String, enum: Object.values(FileTypes), required: true },
    size: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

const FileModel = model<File>("File", fileSchema);

export { FileModel };

