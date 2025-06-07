// app/screens/SignupScreen.tsx
import { View, StyleSheet } from "react-native";
import SignupForm from "../../components/organisms/SignupForm";
import TitlePage from "../../components/molecules/TitlePage";

export default function SignupFormScreen() {
  return (
    <View style={styles.container}>
      {/* Top section - Logo, Title, Subtitle */}
      <View className="flex-1 justify-center items-center">
        <TitlePage showWelcomeMessage={true} />
      </View>
      <SignupForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
});
