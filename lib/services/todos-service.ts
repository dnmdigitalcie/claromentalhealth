import { supabase } from "../supabase/client"

export type Todo = {
  id: number
  task: string
  is_complete: boolean
  created_at: string
  user_id?: string
}

export async function getTodos() {
  try {
    const { data, error } = await supabase.from("todos").select("*")

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error: any) {
    console.error("Error fetching todos:", error)
    return { data: null, error: error.message }
  }
}

export async function addTodo(task: string, userId?: string) {
  try {
    const { data, error } = await supabase
      .from("todos")
      .insert([{ task, user_id: userId }])
      .select()

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error: any) {
    console.error("Error adding todo:", error)
    return { data: null, error: error.message }
  }
}

export async function updateTodoStatus(id: number, isComplete: boolean) {
  try {
    const { data, error } = await supabase.from("todos").update({ is_complete: isComplete }).eq("id", id).select()

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error: any) {
    console.error("Error updating todo:", error)
    return { data: null, error: error.message }
  }
}

export async function deleteTodo(id: number) {
  try {
    const { error } = await supabase.from("todos").delete().eq("id", id)

    if (error) {
      throw error
    }

    return { success: true, error: null }
  } catch (error: any) {
    console.error("Error deleting todo:", error)
    return { success: false, error: error.message }
  }
}
