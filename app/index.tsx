import { useRouter } from "expo-router";
import { Button, View, Text } from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to the App</Text>
      <Button title="Login" onPress={() => router.push("/login")} />
    </View>
  );
}
