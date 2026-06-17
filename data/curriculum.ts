export type { Lesson, Section } from "./types"
import { ML_LESSONS }       from "./lessons/ml"
import { DL_LESSONS }       from "./lessons/deep-learning"
import { NLP_LESSONS }      from "./lessons/nlp"
import { LLM_LESSONS }      from "./lessons/llms"
import { RAG_LESSONS }      from "./lessons/rag"
import { CV_LESSONS }       from "./lessons/cv"
import { MLOPS_LESSONS }    from "./lessons/mlops"
import { INTERVIEW_LESSONS } from "./lessons/interview"

export const CATEGORIES = [
  "Machine Learning",
  "Deep Learning",
  "NLP & Transformers",
  "LLMs & Prompting",
  "RAG Systems",
  "Computer Vision",
  "MLOps",
  "Interview Prep",
]

export const LESSONS = [
  ...ML_LESSONS,
  ...DL_LESSONS,
  ...NLP_LESSONS,
  ...LLM_LESSONS,
  ...RAG_LESSONS,
  ...CV_LESSONS,
  ...MLOPS_LESSONS,
  ...INTERVIEW_LESSONS,
]
