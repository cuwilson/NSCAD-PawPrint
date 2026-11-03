import { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { supabase } from "@/lib/supabase";
import PawPrintBanner from "@/components/PawPrintBanner";
import { colors } from "@/styles/colors";
import { sizes } from "@/styles/sizes";
import { globalStyles } from "@/styles/global";
import DashboardSection from "@/components/dashboard/DashboardSection";
import AddEditPanel from "@/components/overlays/AddEditPanel";
import ReminderForm from "@/components/forms/ReminderForm";

type Pet = {
    pet_id: number;
    name: string;
    species: string;
    breed: string | null;
    birth_date: string | null;
    weight: number | null;
    photo_url: string | null;
};

type DashboardItem = {
    id: number;
    title: string;
    date?: string | null;
    label: string;
};

export default function PetDashboardScreen() {
    const { ownerId, firstName, petId } = useLocalSearchParams();

    const ownerIdValue = Array.isArray(ownerId) ? ownerId[0] : ownerId;
    const firstNameValue = Array.isArray(firstName) ? firstName[0] : firstName;
    const petIdValue = Array.isArray(petId) ? petId[0] : petId;

    const [appointments, setAppointments] = useState<DashboardItem[]>([]);
    const [reminders, setReminders] = useState<DashboardItem[]>([]);
    const [foods, setFoods] = useState<DashboardItem[]>([]);

    const [pet, setPet] = useState<Pet | null>(null);
    const [message, setMessage] = useState("");

    const [activePanel, setActivePanel] = useState<
        | "appointment"
        | "reminder"
        | "food"
        | "appointmentDetails"
        | "reminderDetails"
        | "foodDetails"
        | null
    >(null);

    async function loadPet() {
        const { data, error } = await supabase
            .from("pets")
            .select("pet_id, name, species, breed, birth_date, weight, photo_url")
            .eq("pet_id", Number(petIdValue))
            .eq("owner_id", Number(ownerIdValue))
            .single();

        if (error) {
            setMessage(error.message);
            return;
        }

        setPet(data);

        const { data: appointmentData } = await supabase
            .from("upcoming_appointments")
            .select("appointment_id, appointment_title, appointment_date")
            .eq("pet_id", Number(petIdValue))
            .order("appointment_date");

        setAppointments(
            appointmentData?.map((item) => ({
                id: item.appointment_id,
                title: item.appointment_title,
                date: item.appointment_date,
                label: item.appointment_title,
            })) ?? []
        );

        const { data: reminderData } = await supabase
            .from("upcoming_reminders")
            .select("reminder_title, due_date")
            .eq("pet_id", Number(petIdValue))
            .order("due_date");

        setReminders(
            reminderData?.map((item, index) => ({
                id: index,
                title: item.reminder_title,
                date: item.due_date,
                label: item.reminder_title,
            })) ?? []
        );

        const { data: foodData } = await supabase
            .from("current_pet_foods")
            .select("food_brand, food_name, food_type, bag_size, start_date")
            .eq("pet_id", Number(petIdValue))
            .order("start_date");

        setFoods(
            foodData?.map((item, index) => ({
                id: index,
                title: `${item.food_brand} ${item.food_name}`,
                date: item.start_date,
                label: `${item.food_brand}: ${item.food_name}`,
            })) ?? []
        );
    }

    useEffect(() => {
        if (ownerIdValue && petIdValue) {
            loadPet();
        }
    }, [ownerIdValue, petIdValue]);

    function renderDashboardItem(item: DashboardItem) {
        return (
            <View key={item.id} style={globalStyles.dashboardBulletRow}>
                <Text style={globalStyles.bullet}>•</Text>

                <View style={globalStyles.itemText}>
                    <Text style={globalStyles.cardText}>{item.label}</Text>

                    {item.date ? (
                        <Text style={globalStyles.dashboardItemDate}>{item.date}</Text>
                    ) : null}
                </View>
            </View>
        );
    }

    return (
        <View style={globalStyles.screen}>
            <PawPrintBanner
                showMenu
                ownerId={ownerIdValue}
                firstName={firstNameValue}
            />

            <ScrollView contentContainerStyle={styles.content}>
                {message ? <Text style={globalStyles.message}>{message}</Text> : null}

                {pet ? (
                    <>
                        <View style={styles.heroCard}>
                            <Image
                                source={
                                    pet.photo_url
                                        ? { uri: pet.photo_url }
                                        : require("@/assets/images/pet-placeholder.png")
                                }
                                style={styles.petPhoto}
                            />

                            <Text style={styles.petName}>{pet.name}</Text>
                            <Text style={styles.petDetail}>{pet.species}</Text>

                            {pet.breed ? (
                                <Text style={styles.petDetail}>{pet.breed}</Text>
                            ) : null}

                            {pet.weight ? (
                                <Text style={styles.petDetail}>{pet.weight} lbs</Text>
                            ) : null}
                        </View>

                        <DashboardSection
                            title="Upcoming Events"
                            onAddPress={() => setActivePanel("appointment")}
                        >
                            {appointments.length > 0 ? (
                                appointments.map(renderDashboardItem)
                            ) : (
                                <Text style={globalStyles.cardText}>No upcoming appointments</Text>
                            )}
                        </DashboardSection>

                        <DashboardSection
                            title="Reminders"
                            onAddPress={() => setActivePanel("reminder")}
                        >
                            {reminders.length > 0 ? (
                                reminders.map(renderDashboardItem)
                            ) : (
                                <Text style={globalStyles.cardText}>No reminders yet.</Text>
                            )}
                        </DashboardSection>


                        <DashboardSection
                            title="Food"
                            onAddPress={() => setActivePanel("food")}
                        >
                            {foods.length > 0 ? (
                                foods.map(renderDashboardItem)
                            ) : (
                                <Text style={globalStyles.cardText}>No food records yet.</Text>
                            )}
                        </DashboardSection>

                        <Pressable
                            style={styles.historyButton}
                            onPress={() =>
                                router.push({
                                    pathname: "/under-construction",
                                    params: {
                                        ownerId: ownerIdValue,
                                        firstName: firstNameValue,
                                        pageTitle: "Medical History",
                                    },
                                })
                            }
                        >
                            <Text style={styles.historyButtonText}>
                                View Medical History →
                            </Text>
                        </Pressable>
                    </>
                ) : null}
            </ScrollView>


            <AddEditPanel
                visible={activePanel === "appointment"}
                title="Add Appointment"
                onClose={() => setActivePanel(null)}
            >
                <Text>Appointment form will go here.</Text>
            </AddEditPanel>

            <AddEditPanel
                visible={activePanel === "reminder"}
                title="Add Reminder"
                onClose={() => setActivePanel(null)}
            >
                {ownerIdValue && petIdValue ? (
                    <ReminderForm
                        ownerId={Number(ownerIdValue)}
                        petId={Number(petIdValue)}
                        onSuccess={() => {
                            setActivePanel(null);
                            loadPet();
                        }}
                    />
                ) : null}
            </AddEditPanel>

            <AddEditPanel
                visible={activePanel === "food"}
                title="Add Food"
                onClose={() => setActivePanel(null)}
            >
                <Text>Food form will go here.</Text>
            </AddEditPanel>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },

    content: {
        padding: sizes.screenPadding,
    },

    heroCard: {
        width: "80%",
        alignSelf: "center",

        backgroundColor: colors.tileBackground,
        borderWidth: 5,
        borderColor: colors.brand,
        borderRadius: 45,
        alignItems: "center",
        padding: 16,
        marginBottom: 24,
    },

    petPhoto: {
        width: 180,
        height: 180,
        borderRadius: 45,
        marginBottom: 16,
    },

    petName: {
        fontSize: sizes.title,
        fontWeight: "800",
        color: colors.brand,
    },

    petDetail: {
        fontSize: sizes.body,
        color: colors.accentContrast,
        marginTop: 4,
    },

    sectionTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: colors.brand,
        marginBottom: 8,
    },

    historyButton: {
        backgroundColor: colors.brand,
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 12,
    },

    historyButtonText: {
        color: colors.background,
        fontWeight: "700",
        fontSize: sizes.body,
    },
});