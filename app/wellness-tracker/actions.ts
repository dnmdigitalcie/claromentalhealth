"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export type MoodEntry = {
  id?: number
  user_id?: string
  mood: string
  mood_value: number
  notes?: string
  created_at?: string
}

export async function saveMoodEntry(userId: string, mood: string, notes?: string) {
  if (!userId || !mood) {
    return { success: false, error: "Missing required fields" }
  }

  try {
    // Map mood string to numeric value
    const moodValueMap: Record<string, number> = {
      Great: 5,
      Good: 4,
      Okay: 3,
      Low: 2,
      Bad: 1,
    }

    const moodValue = moodValueMap[mood] || 3

    // Check if wellness_moods table exists, create if it doesn't
    await ensureWellnessMoodsTableExists()

    const { data, error } = await supabase
      .from("wellness_moods")
      .insert([
        {
          user_id: userId,
          mood,
          mood_value: moodValue,
          notes: notes || null, // Ensure notes is null if undefined
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    // Revalidate the wellness tracker page to show updated data
    revalidatePath("/wellness-tracker")

    return { success: true, data }
  } catch (error) {
    console.error("Error saving mood entry:", error)
    return { success: false, error }
  }
}

export async function getMoodEntries(userId: string, startDate?: string, endDate?: string) {
  if (!userId) {
    return { success: false, error: "User ID is required", data: [] }
  }

  try {
    // Check if wellness_moods table exists, create if it doesn't
    await ensureWellnessMoodsTableExists()

    let query = supabase
      .from("wellness_moods")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (startDate) {
      query = query.gte("created_at", startDate)
    }

    if (endDate) {
      query = query.lte("created_at", endDate)
    }

    const { data, error } = await query

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error fetching mood entries:", error)
    return { success: false, error, data: [] }
  }
}

export async function getMoodEntryByDate(userId: string, date: string) {
  if (!userId || !date) {
    return { success: false, error: "User ID and date are required", data: null }
  }

  try {
    // Check if wellness_moods table exists, create if it doesn't
    await ensureWellnessMoodsTableExists()

    // Format date to match the beginning of the day
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const { data, error } = await supabase
      .from("wellness_moods")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", startOfDay.toISOString())
      .lte("created_at", endOfDay.toISOString())
      .order("created_at", { ascending: false })
      .limit(1)

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return { success: true, data: data && data.length > 0 ? data[0] : null }
  } catch (error) {
    console.error("Error fetching mood entry by date:", error)
    return { success: false, error, data: null }
  }
}

// Helper function to ensure the wellness_moods table exists
async function ensureWellnessMoodsTableExists() {
  try {
    // First, try to create the table using SQL
    try {
      await supabase.rpc("create_wellness_moods_table")
      console.log("Table created or already exists via RPC")
      return
    } catch (rpcError) {
      console.log("RPC method not found or failed, trying direct SQL")
    }

    // If RPC fails, check if the table exists by querying it
    const { error } = await supabase.from("wellness_moods").select("id").limit(1)

    // If there's an error with code '42P01', the table doesn't exist
    if (error && error.code === "42P01") {
      console.log("Table doesn't exist, creating it directly")

      // Create the table directly with SQL
      const { error: createError } = await supabase.sql(`
        CREATE TABLE IF NOT EXISTS wellness_moods (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          mood VARCHAR(50) NOT NULL,
          mood_value INTEGER NOT NULL,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE INDEX IF NOT EXISTS idx_wellness_moods_user_id ON wellness_moods(user_id);
        CREATE INDEX IF NOT EXISTS idx_wellness_moods_created_at ON wellness_moods(created_at);
        CREATE INDEX IF NOT EXISTS idx_wellness_moods_user_created ON wellness_moods(user_id, created_at);
      `)

      if (createError) {
        console.error("Error creating table directly:", createError)
        throw createError
      }

      console.log("Table created directly")
    }
  } catch (error) {
    console.error("Error checking/creating wellness_moods table:", error)
    // Continue execution - the app will have to handle the missing table gracefully
  }
}
