import React, { useRef } from "react";
import {
  NavigationContainer,
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import MainScreen from "./screens/MainScreen";
import UserDetailsScreen from "./screens/UserDetailsScreen";
import { SafeAreaView, StyleSheet } from "react-native";
import { AuthProvider } from "./services/AuthProvider";
import ResetNavigation from "./navigation/ResetNavigation";

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const navigationRef = useRef<NavigationContainerRef<ParamListBase>>(null);

  return (
    <SafeAreaView style={styles.container}>
      <AuthProvider>
        <NavigationContainer ref={navigationRef}>
          <ResetNavigation navigationRef={navigationRef} />
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
