import { Schema, model, Types, Document } from "mongoose";

interface Event extends Document {
  title: string;
  description: string;
  planned_date: Date;
  end_date: Date;
  user_id: Types.ObjectId;
  accommodation_id: Types.ObjectId;
}

const eventSchema = new Schema<Event>({
  title: { type: String, required: true, maxLength: 50 },
  description: { type: String, required: true },
  planned_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  accommodation_id: {
    type: Schema.Types.ObjectId,
    ref: "Accommodation",
    required: true,
  },
});

const EventModel = model<Event>("Event", eventSchema);

export default EventModel;
