export interface Role {
  id: number
  name: string
}

export interface User {
  id: number
  username: string
  email: string
  password_hash: string
  role_id: number
  created_at: string
  user_groups_id: number | null
}

export interface UserGroup {
  id: number
  name: string
  manager_id: number | null
}

export interface Course {
  id: number
  name: string
  description: string | null
  created_by: number | null
  created_at: string
}

export interface Module {
  id: number
  course_id: number
  title: string
  description: string | null
  position: number
  created_at: string
}

export interface Lesson {
  id: number
  module_id: number
  title: string
  content: string
  position: number
  created_at: string
}

export interface Assessment {
  id: number
  module_id: number
  title: string
  description: string | null
  created_at: string
}

export interface Question {
  id: number
  assessment_id: number
  question_text: string
  created_at: string
}

export interface Choice {
  id: number
  question_id: number
  choice_text: string
  is_correct: boolean
}

export interface Enrollment {
  id: number
  user_id: number
  course_id: number
  enrolled_at: string
}

export interface Progress {
  id: number
  user_id: number
  module_id: number | null
  lesson_id: number | null
  assessment_id: number | null
  is_completed: boolean
  score: number | null
  updated_at: string
}

export interface MoodEntry {
  id?: number
  user_id?: string
  mood: string
  mood_value: number
  notes?: string
  created_at?: string
}
