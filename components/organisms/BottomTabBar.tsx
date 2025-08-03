import React from "react";
import { View } from "react-native";
import { styled } from "nativewind";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTabsConfig } from "../molecules/BottomTabBar/TabsConfig";
import TabItem from "../atoms/BottomTabBar/TabItem";

// NativeWind components
const StyledView = styled(View);

type RootStackParamList = {
  Splash: undefined;
  Entry: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Profile: undefined;
  Donate: undefined;
  Explore: undefined;
  Activities: undefined;
};

interface BottomTabBarProps {
  activeTab?: string;
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab = "home" }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { tabs, roleColors } = useTabsConfig({ activeTab });

  const handleNavigation = (route: string) => {
    switch (route) {
      case "Donate":
        navigation.navigate("Donate");
        break;
      case "Explore":
        navigation.navigate("Explore");
        break;
      case "Home":
        navigation.navigate("Home");
        break;
      case "Activities":
        navigation.navigate("Activities");
        break;
      case "Profile":
        navigation.navigate("Profile");
        break;
      default:
        console.log(`Navigation to ${route} not implemented`);
    }
  };

  return (
    <StyledView className="bg-white border-t border-gray-200 px-4 py-2">
      <StyledView className="flex-row justify-around items-center">
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            id={tab.id}
            label={tab.label}
            isActive={tab.isActive}
            icon={tab.icon}
            primaryColor={roleColors.primary}
            onPress={handleNavigation}
          />
        ))}
      </StyledView>

      {/* Bottom indicator with role-based color */}
      <StyledView
        className="h-1 rounded-full mt-2 mx-auto"
        style={{
          width: 134,
          backgroundColor: roleColors.secondary,
        }}
      />
    </StyledView>
  );
};

export default BottomTabBar;
