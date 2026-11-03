import { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { supabase } from "@/lib/supabase";
import PawPrintBanner from "@/components/PawPrintBanner";
import { colors } from "@/styles/colors";
import { sizes } from "@/styles/sizes";

type Pet = {
  pet_id: number;
  name: string;
  species: string;
  breed: string | null;
  photo_url: string | null;
};

export default function AnimalsScreen() {
  const { ownerId, firstName } = useLocalSearchParams();

  const ownerIdValue = Array.isArray(ownerId)
    ? ownerId[0]
    : ownerId;

  const firstNameValue = Array.isArray(firstName)
    ? firstName[0]
    : firstName;

  const ownerIdNumber = ownerIdValue
    ? Number(ownerIdValue)
    : null;

  const [pets, setPets] = useState<Pet[]>([]);
  const [message, setMessage] = useState("");

  async function loadPets() {
    const { data, error } = await supabase
      .from("pets")
      .select(
        "pet_id, name, species, breed, photo_url"
      )
      .eq("owner_id", ownerIdNumber)
      .order("name");

    if (error) {
      setMessage(error.message);
      return;
    }

    setPets(data ?? []);
  }

  useEffect(() => {
    if (ownerIdNumber) {
      loadPets();
    }
  }, [ownerIdNumber]);

  return (
    <View style={styles.screen}>
      <PawPrintBanner
        showMenu
        ownerId={ownerIdValue}
        firstName={firstNameValue}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>My Animals</Text>

        {message ? (
          <Text style={styles.message}>{message}</Text>
        ) : null}

        <View style={styles.animalGrid}>
          {pets.map((pet) => (
            <Pressable
              key={pet.pet_id}
              style={styles.animalTile}
              onPress={() =>
                router.push({
                  pathname: "/pet-dashboard",
                  params: {
                    ownerId: ownerIdValue,
                    firstName: firstNameValue,
                    petId: pet.pet_id,
                  },
                })
              }
            >
              <View style={styles.animalPhotoBox}>
                <Image
                  source={
                    pet.photo_url
                      ? { uri: pet.photo_url }
                      : require("@/assets/images/pet-placeholder.png")
                  }
                  style={styles.animalPhoto}
                />
              </View>

              <View style={styles.animalNameBox}>
                <Text style={styles.animalName}>
                  {pet.name}
                </Text>
              </View>
            </Pressable>
          ))}

          <Pressable
            style={styles.animalTile}
            onPress={() =>
              console.log("Add pet pressed")
            }
          >
            <View style={styles.animalPhotoBox}>
              <Image
                source={require("@/assets/images/pet-placeholder.png")}
                style={styles.animalPhoto}
              />
            </View>

            <View style={styles.animalNameBox}>
              <Text style={styles.animalName}>
                Add Pet
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
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

  title: {
    fontSize: sizes.title,
    fontWeight: "800",
    color: colors.brand,
    textAlign: "center",
    marginBottom: 24,
  },

  message: {
    color: colors.accent,
    textAlign: "center",
    marginBottom: 16,
  },

  animalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
  },

  animalTile: {
    width: 172,
    height: 220,
    backgroundColor: colors.background,
    borderWidth: 4,
    borderColor: colors.brand,
    borderRadius: 4,
    overflow: "hidden",
  },

  animalPhotoBox: {
    height: 180,
    backgroundColor: colors.tileBackground,
    borderBottomWidth: 4,
    borderBottomColor: colors.brand,
  },

  animalPhoto: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  animalNameBox: {
    flex: 1,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },

  animalName: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.accentContrast,
    textAlign: "center",
  },
});