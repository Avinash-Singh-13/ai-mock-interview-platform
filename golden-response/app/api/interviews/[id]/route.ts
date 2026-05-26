import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { fail, ok, parseJson } from "@/lib/api";
import { verifyRequest } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Interview } from "@/models/Interview";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = verifyRequest(req);
  if (!user) return fail("Not authenticated.", 401);
  await connectDB();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return fail("Invalid interview session.", 400);
  const interview = await Interview.findById(id).lean();
  if (!interview) return fail("Interview session was not found.", 404);
  return ok({ interview: serialize(interview) });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = verifyRequest(req);
  if (!user) return fail("Not authenticated.", 401);
  const body = await parseJson<{ code?: string; language?: string; note?: string }>(req);
  await connectDB();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return fail("Invalid interview session.", 400);
  const interview = await Interview.findById(id);
  if (!interview) return fail("Interview session was not found.", 404);
  if (typeof body?.code === "string") interview.code = body.code;
  if (body?.language) interview.language = body.language;
  if (body?.note?.trim()) interview.notes.unshift({ text: body.note.trim(), authorId: user.id });
  await interview.save();
  return ok({ interview: serialize(interview) });
}

function serialize(doc: any) {
  return {
    id: doc._id?.toString(),
    category: doc.category,
    difficulty: doc.difficulty,
    status: doc.status,
    question: doc.question,
    code: doc.code,
    language: doc.language,
    notes: doc.notes || [],
    feedback: doc.feedback,
    createdAt: doc.createdAt,
    submittedAt: doc.submittedAt
  };
}
