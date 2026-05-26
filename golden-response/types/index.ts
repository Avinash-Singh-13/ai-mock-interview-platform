export type Role = "candidate" | "interviewer";
export type Category = "DSA" | "Frontend" | "Backend";
export type Difficulty = "Easy" | "Medium" | "Hard";

export type Question = {
  title: string;
  prompt: string;
  constraints: string[];
  examples: string[];
  starterCode: string;
  hints: string[];
};
