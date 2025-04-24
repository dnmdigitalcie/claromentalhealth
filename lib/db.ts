import { supabase } from "./supabase"
import type { Course, Module, Lesson, Assessment, Progress } from "@/types/database"

export async function getCourses() {
  try {
    const { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return { data: data as Course[], error: null }
  } catch (error) {
    console.error("Error fetching courses:", error)
    return { data: [], error }
  }
}

export async function getCourseById(id: number) {
  try {
    const { data, error } = await supabase.from("courses").select("*").eq("id", id).single()

    if (error) throw error

    return { data: data as Course, error: null }
  } catch (error) {
    console.error(`Error fetching course with id ${id}:`, error)
    return { data: null, error }
  }
}

export async function getModulesByCourseId(courseId: number) {
  try {
    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .eq("course_id", courseId)
      .order("position", { ascending: true })

    if (error) throw error

    return { data: data as Module[], error: null }
  } catch (error) {
    console.error(`Error fetching modules for course ${courseId}:`, error)
    return { data: [], error }
  }
}

export async function getLessonsByModuleId(moduleId: number) {
  try {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("module_id", moduleId)
      .order("position", { ascending: true })

    if (error) throw error

    return { data: data as Lesson[], error: null }
  } catch (error) {
    console.error(`Error fetching lessons for module ${moduleId}:`, error)
    return { data: [], error }
  }
}

export async function getAssessmentsByModuleId(moduleId: number) {
  try {
    const { data, error } = await supabase.from("assessments").select("*").eq("module_id", moduleId)

    if (error) throw error

    return { data: data as Assessment[], error: null }
  } catch (error) {
    console.error(`Error fetching assessments for module ${moduleId}:`, error)
    return { data: [], error }
  }
}

export async function getUserProgress(userId: string) {
  try {
    const { data, error } = await supabase.from("progress").select("*").eq("user_id", userId)

    if (error) throw error

    return { data: data as Progress[], error: null }
  } catch (error) {
    console.error(`Error fetching progress for user ${userId}:`, error)
    return { data: [], error }
  }
}

export async function updateProgress(progress: Partial<Progress>) {
  try {
    const { data, error } = await supabase.from("progress").upsert(progress).select()

    if (error) throw error

    return { data: data as Progress[], error: null }
  } catch (error) {
    console.error("Error updating progress:", error)
    return { data: [], error }
  }
}
