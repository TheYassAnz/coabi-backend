import { Schema, model, Types, Document } from "mongoose";

interface Refund extends Document {
  title: string;
  to_refund: number;
  done: boolean;
  user_id: Types.ObjectId;
  roommate_id: Types.ObjectId;
}

const refundSchema = new Schema<Refund>({
  title: { type: String, required: true },
  to_refund: { type: Number, required: true },
  done: { type: Boolean, required: false, default: false },
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  roommate_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const RefundModel = model<Refund>("Refund", refundSchema);

export default RefundModel;
