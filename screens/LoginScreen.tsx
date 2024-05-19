import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../services/AuthProvider";
import { API_URL } from "../config";

type Props = {
  navigation: StackNavigationProp<any>;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(API_URL + "/auth/login", {
        email,
        password,
      });
      if (response.data.accessToken) {
        await signIn(response.data.accessToken);
        navigation.navigate("Main");
      } else {
        Alert.alert(
          "Login Failed",
          "Please check your credentials and try again.",
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Login Error",
        "An error occurred during login. Please try again later.",
      );
    }
  };

  const handleSwitchToRegister = async () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Register" }],
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Go to Register" onPress={handleSwitchToRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: 300,
    height: 50,
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    color: "black",
  },
});

export default LoginScreen;
