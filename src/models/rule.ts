import { Schema, model, Types, Document } from "mongoose";

interface Rule extends Document {
  title: string;
  description: string;
  accommodationId: Types.ObjectId;
}

const ruleSchema = new Schema<Rule>(
  {
    title: { type: String, required: true, maxlength: 50 },
    description: { type: String, required: true, maxlength: 500 },
    accommodationId: {
      type: Schema.Types.ObjectId,
      ref: "Accommodation",
      required: true,
    },
  },
  { timestamps: true },
);

const RuleModel = model<Rule>("Rule", ruleSchema);

export default RuleModel;
