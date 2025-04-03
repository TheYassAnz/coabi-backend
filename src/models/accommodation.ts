import { Schema, model, Document } from "mongoose";

interface Accommodation extends Document {
  name: string;
  code: string;
  location: string;
  postalCode: number;
  country: string;
}

const accommodationSchema = new Schema<Accommodation>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  postalCode: { type: Number, required: true },
  country: { type: String, required: true },
});

const AccommodationModel = model<Accommodation>("Accommodation", accommodationSchema);

export default AccommodationModel;
