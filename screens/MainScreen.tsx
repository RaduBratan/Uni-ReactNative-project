import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, FlatList, Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config";

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      const res = await axios.post(API_URL + "/auth/refresh", {
        refreshToken,
      });
      if (res.status === 200) {
        const newAccessToken = res.data.accessToken;
        await AsyncStorage.setItem("userToken", newAccessToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      }
    }
    return Promise.reject(error);
  },
);

type Props = {
  navigation: StackNavigationProp<any>;
};

type Player = {
  id: string;
  email: string;
};

type Game = {
  id: string;
  status: string;
  player1Id: string;
  player2Id: string;
  playerToMoveId: string;
  player1: Player;
  player2: Player;
};

const MainScreen: React.FC<Props> = ({ navigation }) => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          Alert.alert("Unauthorized", "You need to log in!");
          navigation.navigate("Login");
          return;
        }
        const response = await axios.get(API_URL + "/game", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("games response", response.data.games);
        setGames(response.data.games);
      } catch (error) {
        console.error("Failed to fetch games:", error);
        Alert.alert("Session Expired", "Please log in again.");
        navigation.navigate("Login");
      }
    };

    fetchGames();
  }, [navigation]);

  const renderGame = ({ item }: { item: Game }) => (
    <View style={styles.card}>
      <Text style={styles.detail}>Status: {item.status}</Text>
      <Text style={styles.detail}>Player 1: {item.player1.email}</Text>
      <Text style={styles.detail}>Player 2: {item.player2.email}</Text>
      <Text style={styles.detail}>
        Player to move:{" "}
        {item.playerToMoveId === item.player1.id
          ? item.player1.email
          : item.player2.email}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button
        title="Go to User Details"
        onPress={() => navigation.navigate("UserDetails")}
      />
      <FlatList
        data={games}
        renderItem={renderGame}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    width: "100%",
    color: "black",
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    color: "black",
  },
  detail: {
    fontSize: 18,
    color: "black",
  },
});

export default MainScreen;
