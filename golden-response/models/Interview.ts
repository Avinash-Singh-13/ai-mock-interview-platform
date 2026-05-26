import mongoose, { Schema, models } from "mongoose";

const FeedbackSchema = new Schema(
  {
    summary: String,
    strengths: [String],
    improvements: [String],
    complexity: String,
    bestPractices: [String],
    score: Number
  },
  { _id: false }
);

const InterviewSchema = new Schema(
  {
    candidateId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    interviewerId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    category: { type: String, enum: ["DSA", "Frontend", "Backend"], required: true, index: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    status: { type: String, enum: ["active", "submitted", "reviewed"], default: "active", index: true },
    question: { type: Schema.Types.Mixed, required: true },
    code: { type: String, default: "" },
    language: { type: String, default: "javascript" },
    notes: [{ text: String, authorId: Schema.Types.ObjectId, createdAt: { type: Date, default: Date.now } }],
    feedback: FeedbackSchema,
    submittedAt: Date
  },
  { timestamps: true }
);

InterviewSchema.index({ candidateId: 1, createdAt: -1 });
InterviewSchema.index({ status: 1, createdAt: -1 });

export const Interview = models.Interview || mongoose.model("Interview", InterviewSchema);
