import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { supabase } from "@/lib/supabase";
import FormField from "@/components/small-elements/FormField";
import FormDropdown from "@/components/small-elements/FormDropdown";
import { colors } from "@/styles/colors";
import { scale } from "@/styles/sizes";
import { createReminder } from "@/services/reminderService";

type ReminderFormProps = {
    ownerId: number;
    onSuccess: () => void;
};

type Pet = {
    pet_id: number;
    name: string;
};

type ReminderType = {
    reminder_type_id: number;
    type_name: string;
};

export default function ReminderForm({ ownerId, onSuccess }: ReminderFormProps) {
    const [pets, setPets] = useState<Pet[]>([]);
    const [reminderTypes, setReminderTypes] = useState<ReminderType[]>([]);

    const [petId, setPetId] = useState<number | string | null>(null);
    const [reminderTypeId, setReminderTypeId] = useState<number | string | null>(null);
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function loadFormData() {
            // Only show pets owned by the logged-in user
            const { data: petData } = await supabase
                .from("pets")
                .select("pet_id, name")
                .eq("owner_id", ownerId)
                .order("name");

            // Reminder types come from the database
            const { data: typeData } = await supabase
                .from("reminder_types")
                .select("reminder_type_id, type_name")
                .order("type_name");

            console.log("ownerId in ReminderForm:", ownerId);
            console.log("petData:", petData);
            console.log("typeData:", typeData);

            setPets(petData ?? []);
            setReminderTypes(typeData ?? []);
        }

        if (ownerId) {
            loadFormData();
        }
    }, [ownerId]);


    async function saveReminder() {
        if (!petId || !reminderTypeId || !title.trim()) {
            setMessage("Please fill out all fields.");
            return;
        }

        try {
            await createReminder({
                petId: Number(petId),
                reminderTypeId: Number(reminderTypeId),
                title: title.trim(),
                dueDate: dueDate || null,
            });

            onSuccess();
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to create reminder."
            );
        }
    }


    return (
        <>
            <FormDropdown
                label="Pet"
                selectedValue={petId}
                placeholder="Choose a pet"
                options={pets.map((pet) => ({
                    label: pet.name,
                    value: pet.pet_id,
                }))}
                onValueChange={setPetId}
            />

            <FormDropdown
                label="Reminder Type"
                selectedValue={reminderTypeId}
                placeholder="Choose a reminder type"
                options={reminderTypes.map((type) => ({
                    label: type.type_name,
                    value: type.reminder_type_id,
                }))}
                onValueChange={setReminderTypeId}
            />

            <FormField
                label="Reminder Title"
                value={title}
                onChangeText={setTitle}
                placeholder="Example: Give flea medication"
            />

            <FormField
                label="Due Date"
                value={dueDate}
                onChangeText={setDueDate}
                placeholder="YYYY-MM-DD"
            />

            <Pressable style={styles.button} onPress={saveReminder}>
                <Text style={styles.buttonText}>Save Reminder</Text>
            </Pressable>

            {message ? <Text style={styles.message}>{message}</Text> : null}
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