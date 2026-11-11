
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link } from "expo-router";
import { supabase } from "@/lib/supabase";
import { globalStyles } from "@/styles/global";
import { colors } from "@/styles/colors";
import PawPrintLogo from "@/components/small-elements/PawPrintLogo";
import { isValidEmail } from "@/utils/validation";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function sendResetEmail() {
    const cleanEmail = email.trim().toLowerCase();

    if (!isValidEmail(cleanEmail)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setMessage("");
    setIsSending(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        cleanEmail,
        {
          redirectTo: "http://localhost:8081/update-password",
        }
      );

      if (error) {
        setMessage("Unable to send reset email. Please try again later.");
        return;
      }

      setMessage(
        "If an account exists for this email, you will receive a password reset link."
      );
    } catch (error) {
      setMessage("Unable to request password reset.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <PawPrintLogo size={263} />
      </View>

      <Text style={globalStyles.title}>
        Reset Password
      </Text>

      <Text style={styles.description}>
        Enter your email address to receive a password reset link.
      </Text>

      <TextInput
        placeholder="Email"
        style={globalStyles.loginInput}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Pressable
        style={globalStyles.bigButton}
        onPress={sendResetEmail}
        disabled={isSending}
      >
        <Text style={globalStyles.bigButtonText}>
          {isSending ? "Sending..." : "Send Reset Link"}
        </Text>
      </Pressable>

      {message ? (
        <Text style={globalStyles.message}>
          {message}
        </Text>
      ) : null}

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
  logoBox: {
    width: 263,
    height: 263,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  description: {
    textAlign: "center",
    color: colors.accentContrast,
    fontSize: 16,
    marginBottom: 8,
  },
});
