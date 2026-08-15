import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

// expo-secure-store has no web implementation; fall back to AsyncStorage (localStorage) on web.
const secureStorage = {
  setItemAsync: (key: string, value: string): Promise<void> =>
    Platform.OS === "web"
      ? AsyncStorage.setItem(key, value)
      : SecureStore.setItemAsync(key, value),

  getItemAsync: (key: string): Promise<string | null> =>
    Platform.OS === "web"
      ? AsyncStorage.getItem(key)
      : SecureStore.getItemAsync(key),

  deleteItemAsync: (key: string): Promise<void> =>
    Platform.OS === "web"
      ? AsyncStorage.removeItem(key)
      : SecureStore.deleteItemAsync(key),
};

export default secureStorage;
