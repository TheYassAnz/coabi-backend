import { Schema, model, Types, Document } from 'mongoose';

export enum FileTypes {
  IMAGE = 'image',
  PDF = 'pdf'
}

interface File extends Document {
  _id: string;
  name: string;
  description: string;
  type: FileTypes;
  size: number;
  user_id: Types.ObjectId; 
};

const fileSchema = new Schema<File>({
  _id: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: Object.values(FileTypes), required: true },
  size: { type: Number, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const FileModel = model<File>('File', fileSchema);

export { FileModel };