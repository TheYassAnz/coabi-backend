import { Schema, model, connect } from 'mongoose';

interface Refund {
    title: string;
    to_refund: number;
    done: boolean;
    user_id: number;
    roomate_id: number 
};

const refundSchema = new Schema <Refund>({
    title: {type: String, required: true},
    to_refund: {type: Number, required: true},
    done: {type: Boolean, required: true},
    user_id: {type: Number, required: true},
    roomate_id: {type: Number, required: true}
});

const Refund = model<Refund>('Refund', refundSchema);