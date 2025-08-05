import { useEffect, useState } from "react";
import { Button, View, Text } from "react-native";
import * as SecureStore from "expo-secure-store";

export default function Profile() {
  const [authState, setAuthState] = useState<any>(null);

  useEffect(() => {
    const fetchAuthState = async () => {
      const storedAuthState = await SecureStore.getItemAsync("authState");
      if (storedAuthState) {
        setAuthState(JSON.parse(storedAuthState));
      }
    };

    fetchAuthState();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("authState");
    setAuthState(null);
    console.log("Logged out successfully");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {authState ? (
        <>
          <Text>Welcome, {authState?.id_token || "User"}</Text>
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <Text>Please log in.</Text>
      )}
    </View>
  );
}
