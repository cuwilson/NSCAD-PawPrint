import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { supabase } from "@/lib/supabase";
import { colors } from "@/styles/colors";
import PawPrintBanner from "@/components/PawPrintBanner";
import DashboardSection from "@/components/dashboard/DashboardSection";
import AddEditPanel from "@/components/overlays/AddEditPanel";
import ReminderForm from "@/components/forms/ReminderForm";
import {
  completeReminder as completeReminderService,
  deleteReminder as deleteReminderService,
  getUpcomingReminders,
} from "@/services/reminderService";
import { getUpcomingAppointments } from "@/services/appointmentService";
import { getOwnerPets } from "@/services/petService";

type DashboardItem = {
  id: number;
  petName: string;
  title: string;
  date?: string | null;
  label: string;
};

type Pet = {
  pet_id: number;
  name: string;
  species: string;
  breed: string | null;
  photo_url: string | null;
};



export default function DashboardScreen() {
  const { ownerId, firstName } = useLocalSearchParams();
  const ownerIdValue = Array.isArray(ownerId) ? ownerId[0] : ownerId;
  const firstNameValue = Array.isArray(firstName) ? firstName[0] : firstName;
  const ownerIdNumber = ownerIdValue ? Number(ownerIdValue) : null;

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [appointments, setAppointments] = useState<DashboardItem[]>([]);
  const [reminders, setReminders] = useState<DashboardItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<DashboardItem | null>(null);

  const [pets, setPets] = useState<Pet[]>([]);

  const [activePanel, setActivePanel] = useState<
    | "reminder"
    | "appointment"
    | "pet"
    | "reminderDetails"
    | "appointmentDetails"
    | null
  >(null);


  async function loadDashboardData() {
    if (!ownerIdNumber) return;

    setMessage("");
    setIsLoading(true);

    try {
      // Check dashboard statistics
      const { error } = await supabase
        .from("owner_dashboard_stats")
        .select("*")
        .eq("owner_id", ownerIdNumber)
        .single();

      if (error) {
        throw error;
      }

      // Load appointments
      const appointmentData =
        await getUpcomingAppointments(ownerIdNumber);

      setAppointments(
        appointmentData.map((item) => ({
          id: item.appointment_id,
          petName: item.pet_name,
          title: item.appointment_title,
          date: item.appointment_date,
          label: `${item.pet_name}: ${item.appointment_title}`,
        }))
      );

      // Load reminders
      const reminderData =
        await getUpcomingReminders(ownerIdNumber);

      setReminders(
        reminderData.map((item) => ({
          id: item.reminder_id,
          petName: item.pet_name,
          title: item.reminder_title,
          date: item.due_date,
          label: `${item.pet_name}: ${item.reminder_title}`,
        }))
      );

      // Load pets
      const petData = await getOwnerPets(ownerIdNumber);

      setPets(petData);


    } catch (error) {
      console.error("Dashboard loading error:", error);

      setMessage(
        "Unable to load dashboard information. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }



  useEffect(() => {
    loadDashboardData();
  }, [ownerIdNumber]);


  async function completeReminder(reminderId: number) {
    try {
      await completeReminderService(reminderId);

      setActivePanel(null);
      loadDashboardData();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to complete reminder."
      );
    }
  }



  async function deleteReminder(reminderId: number) {
    try {
      await deleteReminderService(reminderId);

      setActivePanel(null);
      loadDashboardData();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete reminder."
      );
    }
  }


  function renderDashboardItem(
    item: DashboardItem,
    panelType: "appointmentDetails" | "reminderDetails"
  ) {
    const isReminder = panelType === "reminderDetails";

    return (
      <Pressable
        key={item.id}
        style={styles.dashboardBulletRow}
        onPress={() => {
          setSelectedItem(item);
          setActivePanel(panelType);
        }}
      >
        <Text style={styles.bullet}>•</Text>

        <View style={styles.itemContent}>
          <View style={styles.itemText}>
            <Text style={styles.cardText}>{item.label}</Text>

            {item.date ? (
              <Text style={styles.dashboardItemDate}>{item.date}</Text>
            ) : null}
          </View>

          {isReminder ? (
            <Pressable
              style={styles.completeButton}
              onPress={() => completeReminder(item.id)}
            >
              <Text style={styles.smallButtonText}>Done</Text>
            </Pressable>
          ) : null}
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.screen}>
      <PawPrintBanner
        showMenu
        ownerId={ownerIdValue}
        firstName={firstNameValue}
        onMenuPress={() => setMenuOpen((current) => !current)}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Welcome, {firstNameValue}</Text>
        <Text style={styles.subtitle}>PawPrint Dashboard</Text>

        {isLoading && (
          <Text style={styles.message}>
            Loading dashboard...
          </Text>
        )}


        {message ? <Text style={styles.message}>{message}</Text> : null}


        {Boolean(message) && !isLoading && (
          <Pressable
            style={styles.completeButton}
            onPress={loadDashboardData}
          >
            <Text style={styles.smallButtonText}>Retry</Text>
          </Pressable>
        )}


        <DashboardSection
          title="Upcoming Events"
          onAddPress={() => setActivePanel("appointment")}
        >
          {appointments.map((item) =>
            renderDashboardItem(item, "appointmentDetails")
          )}
        </DashboardSection>

        <DashboardSection
          title="Reminders"
          onAddPress={() => setActivePanel("reminder")}
        >
          {reminders.map((item) =>
            renderDashboardItem(item, "reminderDetails")
          )}
        </DashboardSection>

        <Text style={styles.sectionTitle}>My Animals</Text>

        <View style={styles.petGrid}>
          {pets.map((pet) => (
            <Pressable
              key={pet.pet_id}
              style={styles.petTile}
              onPress={() => console.log("Open pet", pet.pet_id)}
            >
              <View style={styles.photoContainer}>
                <Image
                  source={
                    pet.photo_url
                      ? { uri: pet.photo_url }
                      : require("@/assets/images/pet-placeholder.png")
                  }
                  style={styles.petPhoto}
                />
              </View>

              <View style={styles.petInfo}>
                <Text style={styles.petName}>{pet.name}</Text>

                <Text style={styles.petDetail}>
                  • {pet.species}
                </Text>

                {pet.breed ? (
                  <Text style={styles.petDetail}>
                    • {pet.breed}
                  </Text>
                ) : null}

                <Text style={styles.petDetail}>
                  • No alerts
                </Text>
              </View>
            </Pressable>
          ))}

          <Pressable
            style={[styles.petTile, styles.addPetTile]}
            onPress={() => setActivePanel("pet")}
          >
            <View style={styles.photoContainer}>
              <Image
                source={require("@/assets/images/pet-placeholder.png")}
                style={styles.petPhoto}
              />
            </View>

            <View style={styles.petInfo}>
              <Text style={styles.addPetName}>Add Pet</Text>

              <Text style={styles.petDetail}>
                • Create a new profile
              </Text>

              <Text style={styles.petDetail}>
                • Upload a photo
              </Text>

              <Text style={styles.petDetail}>
                • Add reminders
              </Text>
            </View>
          </Pressable>

        </View>
      </ScrollView>

      <AddEditPanel
        visible={activePanel === "reminderDetails"}
        title="Reminder Details"
        onClose={() => setActivePanel(null)}
      >
        {selectedItem ? (
          <>
            <Text style={styles.cardText}>{selectedItem.petName}</Text>
            <Text style={styles.cardText}>{selectedItem.title}</Text>

            {selectedItem.date ? (
              <Text style={styles.cardText}>Due: {selectedItem.date}</Text>
            ) : null}

            <Pressable
              style={styles.editButton}
              onPress={() => setActivePanel("reminder")}
            >
              <Text style={styles.smallButtonText}>Edit</Text>
            </Pressable>

            <Pressable
              style={styles.completeDetailsButton}
              onPress={() => completeReminder(selectedItem.id)}
            >
              <Text style={styles.smallButtonText}>Complete</Text>
            </Pressable>

            <Pressable
              style={styles.deleteButton}
              onPress={() => deleteReminder(selectedItem.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
          </>
        ) : null}
      </AddEditPanel>

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
        {ownerIdNumber ? (
          <ReminderForm
            ownerId={ownerIdNumber}
            onSuccess={() => {
              setActivePanel(null);
              loadDashboardData();
            }}
          />
        ) : null}
      </AddEditPanel>

      <AddEditPanel
        visible={activePanel === "pet"}
        title="Add Pet"
        onClose={() => setActivePanel(null)}
      >
        <Text>Pet form will go here.</Text>
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
    padding: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.brand,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 18,
    color: colors.accentContrast,
    marginBottom: 20,
  },

  message: {
    color: colors.accent,
    marginBottom: 12,
    textAlign: "center",
  },

  cardText: {
    fontSize: 16,
    color: colors.accentContrast,
    fontWeight: "600",
  },

  dashboardBulletRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },

  bullet: {
    fontSize: 32,
    color: colors.accent,
    top: -1,
  },

  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  itemText: {
    marginRight: 12,
  },

  dashboardItemDate: {
    fontSize: 14,
    color: colors.brand,
    marginTop: 2,
    fontWeight: "600",
  },

  completeButton: {
    width: 46,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.brand,
    justifyContent: "center",
    alignItems: "center",
  },

  editButton: {
    backgroundColor: colors.brand,
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
  },

  completeDetailsButton: {
    backgroundColor: colors.brand,
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
  },

  deleteButton: {
    backgroundColor: colors.accent,
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
  },

  smallButtonText: {
    color: colors.background,
    fontWeight: "700",
  },

  deleteButtonText: {
    color: colors.accentContrast,
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.brand,
    marginBottom: 12,
  },

  petGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
    justifyContent: "center",
  },

  addPetTile: {
    borderColor: colors.accent,
    backgroundColor: colors.bannerBackground,
    color: colors.accentContrast,
  },


  petName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.brand,
    marginBottom: 8,
  },

  addPetName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.accentContrast,
    marginBottom: 8,
  },

  petDetail: {
    color: colors.accentContrast,
  },
  photoContainer: {
    width: 140,
    backgroundColor: colors.tileBackground,
    borderRightWidth: 4,
    borderRightColor: colors.brand,
    justifyContent: "center",
    alignItems: "center",
  },

  petPhoto: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  petInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-evenly",
  },

  petTile: {
    flexDirection: "row",
    width: 320,
    maxWidth: "100%",
    backgroundColor: colors.background,
    borderWidth: 4,
    borderColor: colors.brand,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 16,
    minHeight: 180,
  },
});