import OpenAI from "openai";

export const fallbackQuestion = {
  title: "Rate Limited Task Scheduler",
  prompt:
    "Design a function that receives tasks with timestamps and returns the maximum number of tasks that can be executed while respecting a per-minute rate limit.",
  constraints: ["1 <= tasks.length <= 100000", "Timestamps are Unix milliseconds", "Return an efficient O(n log n) or better solution."],
  examples: ["Input: [0, 1000, 61000], limit = 2. Output: 3"],
  starterCode: "function maxExecutableTasks(tasks, limit) {\n  // Write your solution here\n}\n",
  hints: ["Sort timestamps first.", "A sliding window can track the current minute."]
};

function client() {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function generateQuestion(category: string, difficulty: string) {
  const openai = client();
  if (!openai) return fallbackQuestion;

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-5.5",
    messages: [
      { role: "system", content: "Create concise, realistic software engineering interview coding questions. Respond as strict JSON only." },
      {
        role: "user",
        content: `Generate one ${difficulty} ${category} interview problem with title, prompt, constraints array, examples array, starterCode, and hints array.`
      }
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0]?.message?.content || JSON.stringify(fallbackQuestion));
}

export async function generateFeedback(input: {
  question: string;
  code: string;
  notes?: string[];
  category: string;
  difficulty: string;
}) {
  if (!input.code.trim()) {
    return {
      summary: "No solution was submitted.",
      strengths: [],
      improvements: ["Submit code before requesting feedback."],
      complexity: "Not available",
      score: 0
    };
  }

  const openai = client();
  if (!openai) {
    return {
      summary: "Solid practice submission. Add tests and explain edge cases to make the interview answer stronger.",
      strengths: ["Clear attempt at the requested problem", "Suitable foundation for discussion"],
      improvements: ["State time and space complexity", "Cover empty and boundary inputs", "Use small examples to validate the approach"],
      complexity: "Review the dominant loop and data structure operations.",
      score: 72
    };
  }

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-5.5",
    messages: [
      { role: "system", content: "You are a practical senior interviewer. Return strict JSON feedback." },
      {
        role: "user",
        content: JSON.stringify({
          instruction: "Evaluate the candidate solution. Include summary, strengths array, improvements array, complexity, bestPractices array, and score 0-100.",
          ...input
        })
      }
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0]?.message?.content || "{}");
}
