import { Schema, model, Types } from 'mongoose';

interface Refund {
  title: string;
  to_refund: number;
  done: boolean;
  user_id: Types.ObjectId;
  roomate_id: Types.ObjectId 
};

const refundSchema = new Schema <Refund>({
  title: {type: String, required: true},
  to_refund: {type: Number, required: true},
  done: {type: Boolean, required: true},
  user_id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  roomate_id: {type: Schema.Types.ObjectId, ref: 'User', required: true}
});

const Refund = model<Refund>('Refund', refundSchema);

export default Refund;