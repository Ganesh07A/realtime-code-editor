
// Shared types used across frontend and API routes

export interface Room {
  id: string;
  language: SupportedLanguage;
  createdAt: number;
  createdBy: string;
}

export type SupportedLanguage =
  | "typescript"
  | "javascript"
  | "python"
  | "rust"
  | "go";

export interface RoomUser {
  id: string;
  name: string;
  color: string;
}

export type ReviewType = "optimization" | "bug" | "suggestion" | "praise";
export type ReviewSeverity = "info" | "warning" | "error";

export interface CodeReview {
  id: string;
  type: ReviewType;
  line?: number;
  message: string;
  severity: ReviewSeverity;
  suggestedFix?: string;
  timestamp: number;
}

export interface AgentState {
  code: string;
  language: SupportedLanguage;
  previousCode: string;
  reviews: CodeReview[];
  iterationCount: number;
}