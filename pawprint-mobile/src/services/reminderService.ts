
import { supabase } from "@/lib/supabase";

// Marks an existing reminder as completed.
export async function completeReminder(reminderId: number) {
  const { error } = await supabase
    .from("reminders")
    .update({ is_completed: true })
    .eq("reminder_id", reminderId);

  if (error) {
    throw error;
  }
}


 // Deletes an existing reminder.
export async function deleteReminder(reminderId: number) {
  const { error } = await supabase
    .from("reminders")
    .delete()
    .eq("reminder_id", reminderId);

  if (error) {
    throw error;
  }
}



// Retrieves upcoming reminders for a specific owner.
export async function getUpcomingReminders(ownerId: number) {
  const { data, error } = await supabase
    .from("upcoming_reminders")
    .select("reminder_id, pet_name, reminder_title, due_date")
    .eq("owner_id", ownerId)
    .order("due_date");

  if (error) {
    throw error;
  }

  return data ?? [];
}



type NewReminder = {
  petId: number;
  reminderTypeId: number;
  title: string;
  dueDate: string | null;
};

// Creates a new reminder in the database.
export async function createReminder(reminder: NewReminder) {
  const { error } = await supabase
    .from("reminders")
    .insert({
      pet_id: reminder.petId,
      reminder_title: reminder.title,
      reminder_type_id: reminder.reminderTypeId,
      due_date: reminder.dueDate,
      is_completed: false,
    });

  if (error) {
    throw error;
  }
}

