
import { useEffect, useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { Link } from "expo-router";
import { supabase } from "@/lib/supabase";
import { isValidPassword } from "@/utils/password";
import { globalStyles } from "@/styles/global";
import { colors } from "@/styles/colors";

export default function UpdatePasswordScreen() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [isRecoverySession, setIsRecoverySession] = useState(false);



    useEffect(() => {
        const { data: { subscription } } =
            supabase.auth.onAuthStateChange((event) => {
                if (event === "PASSWORD_RECOVERY") {
                    setIsRecoverySession(true);
                }
            });

        async function checkAccess() {
            const { data, error } = await supabase.auth.getUser();

            setIsAuthorized(!error && Boolean(data.user));
            setIsChecking(false);
        }

        checkAccess();

        return () => {
            subscription.unsubscribe();
        };
    }, []);


    async function updatePassword() {
        if (!isAuthorized || !isRecoverySession || isSaving) return;

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

        setIsSaving(true);
        setMessage("");

        try {
            const { error } = await supabase.auth.updateUser({
                password,
            });

            if (error) {
                setMessage("Unable to update password. Please try again.");
                return;
            }

            // Require a fresh login after changing the password.
            await supabase.auth.signOut();

            setIsAuthorized(false);
            setIsComplete(true);
            setMessage("Password updated! You can now log in.");
        } catch (error) {
            setMessage("Unable to update password.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={globalStyles.title}>
                Update Password
            </Text>

            {isChecking ? (
                <Text style={styles.description}>
                    Checking account access...
                </Text>
            ) : isComplete ? (
                <Text style={globalStyles.message}>
                    {message}
                </Text>
            ) : !isAuthorized || !isRecoverySession ? (
                <Text style={styles.description}>
                    No valid session found. Request a new password
                    reset link or sign in.
                </Text>
            ) : (
                <>
                    <Text style={styles.description}>
                        Enter your new password below.
                    </Text>

                    <TextInput
                        placeholder="New Password"
                        style={globalStyles.loginInput}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TextInput
                        placeholder="Confirm New Password"
                        style={globalStyles.loginInput}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />

                    <Pressable
                        style={globalStyles.bigButton}
                        onPress={updatePassword}
                        disabled={isSaving}
                    >
                        <Text style={globalStyles.bigButtonText}>
                            {isSaving ? "Saving..." : "Update Password"}
                        </Text>
                    </Pressable>

                    {message ? (
                        <Text style={globalStyles.message}>
                            {message}
                        </Text>
                    ) : null}
                </>
            )}

            <Link href="/login" asChild>
                <Pressable style={globalStyles.backButton}>
                    <Text>← Back to Login</Text>
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
    description: {
        fontSize: 16,
        color: colors.accentContrast,
        textAlign: "center",
        marginBottom: 8,
    },
});
