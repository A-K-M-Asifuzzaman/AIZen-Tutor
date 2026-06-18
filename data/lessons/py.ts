import type { Lesson } from "../types"
import { PYTHON_BASICS } from "./py-basics"
import { PYTHON_CONTROL_FLOW } from "./py-control-flow"
import { PYTHON_FUNCTIONS } from "./py-functions"
import { PYTHON_OOP } from "./py-oop"
import { PYTHON_LISTS } from "./py-lists"
import { PYTHON_DICTS } from "./py-dicts"
import { PYTHON_FILE_IO } from "./py-file-io"
import { PYTHON_MODULES } from "./py-modules"
import { PYTHON_ADVANCED } from "./py-advanced"
import { PYTHON_DATA_SCIENCE } from "./py-data-science"
import {PYTHON_STRING } from "./py-string"

export const PY_LESSONS: Lesson[] = [
  PYTHON_BASICS,
  PYTHON_CONTROL_FLOW,
  PYTHON_STRING,
  PYTHON_LISTS,
  PYTHON_DICTS,
  PYTHON_FUNCTIONS,
  PYTHON_FILE_IO,
  PYTHON_OOP,
  PYTHON_MODULES,
  PYTHON_ADVANCED,
  PYTHON_DATA_SCIENCE
]