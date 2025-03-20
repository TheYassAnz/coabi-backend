import { Schema, model } from "mongoose";

const accommodationSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  postalCode: { type: Number, required: true },
  country: { type: String, required: true },
});

const accommodationModel = model("Accommodation", accommodationSchema);

export default accommodationModel;
