import { Schema, model, Types, Document } from 'mongoose';

interface Rule extends Document {
  title: string;
  description: string;
  accommodation_id: Types.ObjectId; 
};

const ruleSchema = new Schema<Rule>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  accommodation_id: { type: Schema.Types.ObjectId, ref: 'Accommodation', required: true }
})

const RuleModel = model<Rule>('Rule', ruleSchema);

export default RuleModel;
