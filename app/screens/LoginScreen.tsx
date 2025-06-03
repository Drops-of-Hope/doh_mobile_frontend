import { View, StyleSheet } from 'react-native';
import LoginForm from '../../components/organisms/LoginForm';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <LoginForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
});
