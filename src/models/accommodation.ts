import { Schema, model, Types, Document } from "mongoose";

interface Accommodation extends Document {
  _id: Types.ObjectId;
  name: string;
  code: string;
  location: string;
  postalCode: number;
  country: string;
}

const accommodationSchema = new Schema<Accommodation>(
  {
    name: { type: String, required: true, maxlength: 50 },
    code: { type: String, required: true, unique: true, maxlength: 12 },
    location: { type: String, required: true, maxlength: 30 },
    postalCode: { type: Number, required: true, min: 501, max: 100000 },
    country: { type: String, required: true, maxlength: 30 },
  },
  { timestamps: true },
);

const AccommodationModel = model<Accommodation>(
  "Accommodation",
  accommodationSchema,
);

export default AccommodationModel;
