
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import FormField from "@/components/small-elements/FormField";
import FormDropdown from "@/components/small-elements/FormDropdown";
import { getOwnerPets } from "@/services/petService";
import { createAppointment } from "@/services/appointmentService";
import { colors } from "@/styles/colors";
import { scale } from "@/styles/sizes";

type AppointmentFormProps = {
  ownerId: number;
  onSuccess: () => void;
};

type PetOption = {
  pet_id: number;
  name: string;
};

export default function AppointmentForm({
  ownerId,
  onSuccess,
}: AppointmentFormProps) {
  const [pets, setPets] = useState<PetOption[]>([]);
  const [petId, setPetId] = useState<number | string | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [provider, setProvider] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Populate the pet dropdown for the current owner.
  useEffect(() => {
    async function loadPets() {
      try {
        const data = await getOwnerPets(ownerId);
        setPets(data);
      } catch (error) {
        setMessage("Unable to load pets.");
      }
    }

    loadPets();
  }, [ownerId]);

  async function saveAppointment() {
    if (!petId || !title.trim() || !date.trim() || !time.trim()) {
      setMessage("Please fill out all required fields.");
      return;
    }

    // Require YYYY-MM-DD and HH:MM in 24-hour time.
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

    if (!datePattern.test(date) || !timePattern.test(time)) {
      setMessage("Use YYYY-MM-DD for date and HH:MM for time.");
      return;
    }

    const [year, month, day] = date.split("-").map(Number);
    const parsedDate = new Date(year, month - 1, day);

    if (
      parsedDate.getFullYear() !== year ||
      parsedDate.getMonth() !== month - 1 ||
      parsedDate.getDate() !== day
    ) {
      setMessage("Please enter a valid appointment date.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      await createAppointment({
        petId: Number(petId),
        title: title.trim(),
        appointmentDate: `${date}T${time}:00`,
        providerName: provider.trim() || null,
        location: location.trim() || null,
        notes: notes.trim() || null,
      });

      onSuccess();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to create appointment."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <FormDropdown
        label="Pet *"
        selectedValue={petId}
        placeholder="Choose a pet"
        options={pets.map((pet) => ({
          label: pet.name,
          value: pet.pet_id,
        }))}
        onValueChange={setPetId}
      />

      <FormField
        label="Appointment Title *"
        value={title}
        onChangeText={setTitle}
        placeholder="Example: Annual vet exam"
      />

      <FormField
        label="Date *"
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
      />

      <FormField
        label="Time *"
        value={time}
        onChangeText={setTime}
        placeholder="HH:MM (24-hour)"
      />

      <FormField
        label="Provider"
        value={provider}
        onChangeText={setProvider}
        placeholder="Veterinarian or clinic"
      />

      <FormField
        label="Location"
        value={location}
        onChangeText={setLocation}
        placeholder="Clinic address"
      />

      <FormField
        label="Notes"
        value={notes}
        onChangeText={setNotes}
        placeholder="Additional information"
        multiline
      />

      <Pressable
        style={styles.button}
        onPress={saveAppointment}
        disabled={isSaving}
      >
        <Text style={styles.buttonText}>
          {isSaving ? "Saving..." : "Save Appointment"}
        </Text>
      </Pressable>

      {message ? (
        <Text style={styles.message}>{message}</Text>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.accent,
    padding: scale(14),
    borderRadius: scale(14),
    alignItems: "center",
    marginTop: scale(8),
  },
  buttonText: {
    color: colors.background,
    fontWeight: "800",
  },
  message: {
    color: colors.accent,
    textAlign: "center",
  },
});
