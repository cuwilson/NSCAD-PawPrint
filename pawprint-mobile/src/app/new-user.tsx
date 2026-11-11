import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, ScrollView, View } from "react-native";
import { supabase } from "@/lib/supabase";
import { Link } from "expo-router";
import PawPrintLogo from "@/components/small-elements/PawPrintLogo";
import { globalStyles } from "@/styles/global";
import { sizes } from "@/styles/sizes";
import { isValidPassword } from "@/utils/password";
import {
    isRequired,
    isValidEmail,
    isValidLength,
} from "@/utils/validation";



export default function NewUserScreen() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    



    async function createOwner() {
        setMessage("");

        const cleanFirstName = firstName.trim();
        const cleanLastName = lastName.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanPhone = phone.trim();

        if (!isRequired(cleanFirstName) || !isRequired(cleanLastName)) {
            setMessage("Please enter your first and last name.");
            return;
        }

        if (
            !isValidLength(cleanFirstName, 100) ||
            !isValidLength(cleanLastName, 100)
        ) {
            setMessage("Names must be 100 characters or less.");
            return;
        }

        if (!isValidEmail(cleanEmail)) {
            setMessage("Please enter a valid email address.");
            return;
        }

        if (!isValidLength(cleanPhone, 30)) {
            setMessage("Phone number must be 30 characters or less.");
            return;
        }

        if (!isValidPassword(password)) {
            setMessage(
                "Password must be at least 8 characters and contain a number."
            );
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            const { error } = await supabase.auth.signUp({
                email: cleanEmail,
                password,
                options: {
                    data: {
                        first_name: cleanFirstName,
                        last_name: cleanLastName,
                        phone: cleanPhone || null,
                    },
                },
            });

            if (error) {
                setMessage("Unable to create account: " + error.message);
                return;
            }

            setMessage(
                "Registration submitted! Check your email for a confirmation link if required, then log in."
            );
        } catch (error) {
            setMessage("Unable to create account. Please try again.");
        }
    }


    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <Text style={globalStyles.title}>Create Account</Text>
            <View style={styles.logoWrapper}>
                <PawPrintLogo size={150} />
            </View>
            <TextInput placeholder="First Name" style={globalStyles.input} value={firstName} onChangeText={setFirstName} />
            <TextInput placeholder="Last Name" style={globalStyles.input} value={lastName} onChangeText={setLastName} />
            <TextInput placeholder="Email" style={globalStyles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
            <TextInput placeholder="Phone" style={globalStyles.input} value={phone} onChangeText={setPhone} />

            <TextInput
                placeholder="Password"
                style={globalStyles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TextInput
                placeholder="Confirm Password"
                style={globalStyles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />

            
            <Pressable style={globalStyles.accentButton} onPress={createOwner}>
                <Text style={globalStyles.accentButtonText}>Create Account</Text>
            </Pressable>

            {message ? <Text style={globalStyles.message}>{message}</Text> : null}
            <Link href="/" asChild>
                <Pressable style={globalStyles.backButton}>
                    <Text>← Back</Text>
                </Pressable>
            </Link>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: globalStyles.screen.backgroundColor,
        padding: sizes.screenPadding,
        gap: 12,
        paddingTop: 40,
        paddingBottom: 40,
    },

    logoWrapper: {
        alignItems: "center",
        marginBottom: 12,
    },
});