// components/organisms/SignupForm.tsx
import { View } from 'react-native';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

export default function SignupForm() {
  return (
    <View>
      <Input placeholder="Full Name" />
      <Input placeholder="Email" />
      <Input placeholder="Password" secureTextEntry />
      <Button title="Sign Up" onPress={() => console.log('Signing up...')} />
    </View>
  );
}
