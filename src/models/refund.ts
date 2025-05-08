import { Schema, model, Types, Document } from "mongoose";

interface Refund extends Document {
  _id: Types.ObjectId;
  title: string;
  toRefund: number;
  done: boolean;
  userId: Types.ObjectId;
  roommateId: Types.ObjectId;
  accommodationId: Types.ObjectId;
}

const refundSchema = new Schema<Refund>(
  {
    title: { type: String, required: true, maxlength: 50 },
    toRefund: { type: Number, required: true, min: 0, max: 1000000 },
    done: { type: Boolean, required: false, default: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    roommateId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    accommodationId: {
      type: Schema.Types.ObjectId,
      ref: "Accommodation",
      required: true,
    },
  },
  { timestamps: true },
);

const RefundModel = model<Refund>("Refund", refundSchema);

export default RefundModel;
