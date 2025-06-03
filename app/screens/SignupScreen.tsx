// app/screens/SignupScreen.tsx
import { View, StyleSheet } from 'react-native';
import SignupForm from '../../components/organisms/SignupForm';

export default function SignupScreen() {
  return (
    <View style={styles.container}>
      <SignupForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
});
