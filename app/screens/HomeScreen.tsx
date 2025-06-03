// app/screens/HomeScreen.tsx
import { View, Text } from 'react-native';
import Button from '../../components/atoms/Button';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Signup: undefined;
};

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold mb-4">Welcome to the Drops of Hope</Text>
      <Button title="Login" onPress={() => navigation.navigate('Login')} />
      <View className="h-4" />
      <Button title="Sign Up" onPress={() => navigation.navigate('Signup')} />
    </View>
  );
}
