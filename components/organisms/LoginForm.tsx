import { View } from 'react-native';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

export default function LoginForm() {
  return (
    <View>
      <Input placeholder="Email" />
      <Input placeholder="Password" secureTextEntry />
      <Button title="Login" onPress={() => console.log('Logging in...')} />
    </View>
  );
}
