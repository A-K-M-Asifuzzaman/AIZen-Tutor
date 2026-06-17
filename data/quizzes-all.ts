import { QUIZZES } from "./quizzes"
import { QUIZZES_EXTRA } from "./quizzes-extra"
import type { QuizQuestion } from "./quizzes"

export type { QuizQuestion }

export const ALL_QUIZZES: Record<string, QuizQuestion[]> = Object.fromEntries(
  Object.keys({ ...QUIZZES, ...QUIZZES_EXTRA }).map((key) => [
    key,
    [...(QUIZZES[key] ?? []), ...(QUIZZES_EXTRA[key] ?? [])],
  ])
)
