
import { supabase } from "@/lib/supabase";

// Retrieves the pets belonging to a specific owner.
export async function getOwnerPets(ownerId: number) {
  const { data, error } = await supabase
    .from("pets")
    .select("pet_id, name, species, breed, photo_url")
    .eq("owner_id", ownerId)
    .order("name");

  if (error) {
    throw error;
  }

  return data ?? [];
}
