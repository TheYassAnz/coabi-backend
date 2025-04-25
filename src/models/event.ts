import { Schema, model, Types, Document } from "mongoose";

interface Event extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  plannedDate: Date;
  endDate: Date;
  userId: Types.ObjectId;
  accommodationId: Types.ObjectId;
}

const eventSchema = new Schema<Event>(
  {
    title: { type: String, required: true, maxlength: 50 },
    description: {
      type: String,
      required: false,
      default: null,
      maxlength: 500,
    },
    plannedDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    accommodationId: {
      type: Schema.Types.ObjectId,
      ref: "Accommodation",
      required: true,
    },
  },
  { timestamps: true },
);

const EventModel = model<Event>("Event", eventSchema);

export default EventModel;
