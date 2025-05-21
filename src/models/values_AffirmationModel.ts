import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const valueSchema = new Schema(
  {
    valueName: { type: String },
    generateWithAi: { type: Boolean, default: false },
    storeAiAffirmations: { type: Boolean, default: false },
    activateNotification: { type: Boolean, default: false },
    notificationSetting: {
      type: { intervalName: String, intervalValue: String },
      default: { intervalName: "Daily", intervalValue: "09:00" }
    },
    readAffirmation: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const affirmationSchema = new Schema(
  {
    valueId: { type: Types.ObjectId, ref: "values", required: true },
    valueName: { type: String },
    affirmation: { type: String }
  },
  { timestamps: true }
);

export const Value = model("values", valueSchema);
export const Affirmation = model("affirmations", affirmationSchema);
