import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../services/AuthProvider";
import { API_URL } from "../config";

type Props = {
  navigation: StackNavigationProp<any>;
};

const UserDetailsScreen: React.FC<Props> = ({ navigation }) => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { signOut } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          Alert.alert("Authentication Error", "You are not logged in.");
          navigation.navigate("Login");
          return;
        }
        const response = await axios.get(API_URL + "/user/details/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("user details response", response.data);
        setUserDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        Alert.alert("Error", "Failed to fetch user details.");
      }
    };

    fetchUserDetails();
  }, [navigation]);

  const handleLogout = async () => {
    await signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!userDetails) {
    return (
      <View style={styles.container}>
        <Text>No user details available.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!userDetails) {
    return (
      <View style={styles.container}>
        <Text>No user details available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />
      <Text style={styles.detail}>Email: {userDetails.user.email}</Text>
      <Text style={styles.detail}>
        Games played: {userDetails.user.gamesPlayed}
      </Text>
      <Text style={styles.detail}>Games won: {userDetails.user.gamesWon}</Text>
      <Text style={styles.detail}>
        Games lost: {userDetails.user.gamesLost}
      </Text>
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
  detail: {
    fontSize: 18,
    margin: 10,
    color: "black",
  },
});

export default UserDetailsScreen;
