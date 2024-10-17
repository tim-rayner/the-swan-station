import mongoose, { Document, Schema } from "mongoose";

export interface IResetLog {
  resetTime: Date;
  user: string;
}

export interface IIncidentLog {
  incidentTime: Date;
}

export interface ICountdown extends Document {
  timer: number;
  resetLogs: IResetLog[];
  incidentLogs: IIncidentLog[];
}

const countdownSchema: Schema = new Schema({
  timer: {
    type: Number,
    required: true,
  },
  resetLogs: [
    {
      resetTime: { type: Date, default: Date.now },
      user: { type: String, required: true },
    },
  ],
  incidentLogs: [
    {
      incidentTime: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.models.Countdown ||
  mongoose.model<ICountdown>("Countdown", countdownSchema);
