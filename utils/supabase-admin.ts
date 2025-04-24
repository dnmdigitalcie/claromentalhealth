import { supabase } from "@/lib/supabase"

/**
 * Create or retrieve a customer in the database
 * This is a simplified implementation for the Claro Mental Health LMS
 */
export async function createOrRetrieveCustomer({
  uuid,
  email,
}: {
  uuid: string
  email: string
}): Promise<string> {
  try {
    // Check if customer exists
    const { data: existingCustomer, error: fetchError } = await supabase
      .from("customers")
      .select("stripe_customer_id")
      .eq("user_id", uuid)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching customer:", fetchError)
      throw fetchError
    }

    // If customer exists, return the customer ID
    if (existingCustomer?.stripe_customer_id) {
      return existingCustomer.stripe_customer_id
    }

    // For demo purposes, create a mock customer ID
    const mockCustomerId = `cus_mock_${uuid.substring(0, 8)}`

    // Insert the new customer
    const { error: insertError } = await supabase.from("customers").insert({
      user_id: uuid,
      email,
      stripe_customer_id: mockCustomerId,
    })

    if (insertError) {
      console.error("Error creating customer:", insertError)
      throw insertError
    }

    return mockCustomerId
  } catch (error) {
    console.error("Error in createOrRetrieveCustomer:", error)
    return `cus_error_${Date.now()}`
  }
}
