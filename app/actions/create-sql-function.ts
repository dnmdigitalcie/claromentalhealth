"use server"

import { supabase } from "@/lib/supabase"

export async function createSqlFunction() {
  try {
    // Create a stored procedure to execute SQL
    const { error } = await supabase.rpc("create_exec_sql_function")

    if (error) {
      // If the function doesn't exist, create it directly
      const { error: createError } = await supabase.sql(`
        CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
        RETURNS jsonb
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          result jsonb;
        BEGIN
          EXECUTE sql_query;
          result := '{"status": "success"}'::jsonb;
          RETURN result;
        EXCEPTION WHEN OTHERS THEN
          result := jsonb_build_object(
            'status', 'error',
            'message', SQLERRM,
            'code', SQLSTATE
          );
          RETURN result;
        END;
        $$;
      `)

      if (createError) {
        throw createError
      }
    }

    return { success: true, message: "SQL function created successfully" }
  } catch (error) {
    console.error("Error creating SQL function:", error)
    return { success: false, message: "Failed to create SQL function", error }
  }
}
