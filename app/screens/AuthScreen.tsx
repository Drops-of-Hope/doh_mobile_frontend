import { View, ScrollView, SafeAreaView } from "react-native";
import AuthTabs from "../../components/organisms/AuthTabs";
import TitlePage from "../../components/molecules/TitlePage";

export default function AuthScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100 py-10">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Compact Header */}
        <View className="mb-6">
          <TitlePage
            showWelcomeMessage={false}
            titleSize="small"
            alignment="center"
          />
        </View>

        {/* Auth Tabs with Forms */}
        <View className="flex-1 bg-white rounded-[20px] p-6 shadow-lg min-h-[500px]">
          <AuthTabs />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
