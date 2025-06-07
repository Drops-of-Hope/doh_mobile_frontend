import { View } from "react-native";
import Input from "../atoms/Input";
import Button from "../atoms/Button";

export default function LoginForm() {
  const handleLogin = () => {
    // Add your login logic here: form validation, API call, auth handling, etc.
    console.log("Logging in...");
    // Example: Alert.alert('Login', 'Logged in successfully!');
  };

  return (
    <View>
      <Input placeholder="Email" />
      <Input placeholder="Password" secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
