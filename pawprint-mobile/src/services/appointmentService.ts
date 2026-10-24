
import { supabase } from "@/lib/supabase";

// Retrieves upcoming appointments for a specific owner.
export async function getUpcomingAppointments(ownerId: number) {
  const { data, error } = await supabase
    .from("upcoming_appointments")
    .select("appointment_id, pet_name, appointment_title, appointment_date")
    .eq("owner_id", ownerId)
    .order("appointment_date");

  if (error) {
    throw error;
  }

  return data ?? [];
}
