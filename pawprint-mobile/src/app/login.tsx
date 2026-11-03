import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router, Link } from "expo-router";
import { supabase } from "@/lib/supabase";
import { globalStyles } from "@/styles/global";
import { colors } from "@/styles/colors";
import PawPrintLogo from "@/components/small-elements/PawPrintLogo";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");


    async function findOwner() {
        setMessage("");

        // Authenticate through Supabase Auth.
        const { data: authData, error: authError } =
            await supabase.auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password: password,
            });

        if (authError || !authData.user) {
            setMessage("Invalid email or password.");
            return;
        }

        // Find the PawPrint owner linked to this Auth account.
        const { data: owner, error: ownerError } = await supabase
            .from("owners")
            .select("owner_id, first_name")
            .eq("auth_user_id", authData.user.id)
            .single();

        if (ownerError || !owner) {
            await supabase.auth.signOut();
            setMessage("Unable to find the associated PawPrint account.");
            return;
        }

        router.replace({
            pathname: "/dashboard",
            params: {
                ownerId: owner.owner_id,
                firstName: owner.first_name,
            },
        });
    }


    return (
        <View style={styles.container}>
            <View style={styles.logoBox}>
                <PawPrintLogo size={263} />
            </View>

            <TextInput
                placeholder="Email"
                style={globalStyles.loginInput}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />

            <TextInput
                placeholder="Password"
                style={globalStyles.loginInput}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Link href="/forgot-password" asChild>
                <Pressable style={globalStyles.smallButton}>
                    <Text style={globalStyles.smallButtonText}>
                        Forgot Password?
                    </Text>
                </Pressable>
            </Link>

            <Pressable style={globalStyles.bigButton} onPress={findOwner}>
                <Text style={globalStyles.bigButtonText}>Login</Text>
            </Pressable>

            {message ? (
                <Text style={globalStyles.message}>
                    {message}
                </Text>
            ) : null}

            <Link href="/" asChild>
                <Pressable style={globalStyles.backButton}>
                    <Text>← Back</Text>
                </Pressable>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 12,
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
    },

    logoBox: {
        width: 263,
        height: 263,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 32,
    },


});