import { View, StyleSheet } from "react-native";
import LoginForm from "../../components/organisms/LoginForm";
import TitlePage from "../../components/molecules/TitlePage";

export default function LoginFormScreen() {
  return (
    <View style={styles.container}>
      {/* Top section - Logo, Title, Subtitle */}
      <View className="flex-1 justify-center items-center">
        <TitlePage showWelcomeMessage={true} />
      </View>

      <LoginForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
});
