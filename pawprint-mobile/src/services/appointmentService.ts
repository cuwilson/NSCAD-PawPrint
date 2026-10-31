
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


type NewAppointment = {
  petId: number;
  title: string;
  appointmentDate: string;
  providerName: string | null;
  location: string | null;
  notes: string | null;
};

// Creates a scheduled appointment for a pet.
export async function createAppointment(appointment: NewAppointment) {
  const { error } = await supabase
    .from("appointments")
    .insert({
      pet_id: appointment.petId,
      appointment_title: appointment.title,
      appointment_date: appointment.appointmentDate,
      provider_name: appointment.providerName,
      location: appointment.location,
      notes: appointment.notes,
      status: "Scheduled",
    });

  if (error) {
    throw error;
  }
}


 // Retrieves complete information for a selected appointment.
export async function getAppointmentDetails(appointmentId: number) {
  const { data, error } = await supabase
    .from("appointments")
    .select(`
      appointment_id,
      appointment_title,
      appointment_date,
      provider_name,
      location,
      notes,
      status
    `)
    .eq("appointment_id", appointmentId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
