export interface Section {
  heading: string
  body?: string
  code?: string
  note?: string
}

export interface Lesson {
  id: string
  title: string
  category: string
  content: Section[]
}
