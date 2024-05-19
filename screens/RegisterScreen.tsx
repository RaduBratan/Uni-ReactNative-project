import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../services/AuthProvider";
import { API_URL } from "../config";

type Props = {
  navigation: StackNavigationProp<any>;
};

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { signIn } = useAuth();

  const handleRegister = async () => {
    try {
      const registerResponse = await axios.post(API_URL + "/auth/register", {
        email,
        password,
      });
      console.log("register response", registerResponse.data);
      if (registerResponse.data.id && registerResponse.data.email) {
        const loginResponse = await axios.post(API_URL + "/auth/login", {
          email,
          password,
        });
        if (loginResponse.data.accessToken) {
          await signIn(loginResponse.data.accessToken);
          navigation.navigate("Main");
        } else {
          Alert.alert(
            "Login Failed",
            "Automatic login failed, please try to login manually.",
          );
        }
      } else {
        Alert.alert(
          "Registration Failed",
          "Please check your details and try again.",
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Registration Error",
        "An error occurred during registration. Please try again later.",
      );
    }
  };

  const handleSwitchToLogin = async () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
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
      <Button title="Register" onPress={handleRegister} />
      <Button title="Go to Login" onPress={handleSwitchToLogin} />
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

export default RegisterScreen;
