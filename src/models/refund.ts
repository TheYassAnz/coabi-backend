import { Schema, model, Types, Document } from "mongoose";

interface Refund extends Document {
  title: string;
  toRefund: number;
  done: boolean;
  userId: Types.ObjectId;
  roomateId: Types.ObjectId;
}

const refundSchema = new Schema<Refund>(
  {
    title: { type: String, required: true, maxlength: 50 },
    toRefund: { type: Number, required: true, min: 0, max: 1000000 },
    done: { type: Boolean, required: false, default: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    roomateId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

const RefundModel = model<Refund>("Refund", refundSchema);

export default RefundModel;
