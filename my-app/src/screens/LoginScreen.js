import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Sabit mock kullanıcı
  const MOCK_USER = {
    email: "user@example.com",
    password: "password123",
  };

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in both email and password.");
      return;
    }

    if (email !== MOCK_USER.email || password !== MOCK_USER.password) {
      setError("Invalid email or password.");
      return;
    }

    setError("");
    navigation.replace("MainApp");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  errorContainer: {
    backgroundColor: "#ffe6e6",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "red",
  },
  errorText: { color: "red", textAlign: "center", fontWeight: "bold" },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  link: { color: "blue", marginTop: 15, textAlign: "center" },
});
