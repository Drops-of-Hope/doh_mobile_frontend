import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { styled } from "nativewind";
import Svg, { Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useRoleBasedAccess } from "../../app/hooks/useRoleBasedAccess";

// NativeWind components
const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

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
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { getRoleColors, canDonate, canVolunteer, canManageCampaigns, currentRole } = useRoleBasedAccess();
  const roleColors = getRoleColors();

  // Debug logging to understand role-based access
  console.log("BottomTabBar Debug:", {
    currentRole,
    canDonate: canDonate(),
    canVolunteer: canVolunteer(),
    canManageCampaigns: canManageCampaigns()
  });

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
  // Icon components with role-based active color
  const DropIcon = ({ isActive }: { isActive: boolean }) => (
    <View className="w-6 h-6">
      <Svg
        fill={isActive ? roleColors.primary : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33"
        />
      </Svg>
    </View>
  );

  const SearchIcon = ({ isActive }: { isActive: boolean }) => (
    <View className="w-6 h-6">
      <Svg
        fill={isActive ? roleColors.primary : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </Svg>
    </View>
  );

  const HomeIcon = ({ isActive }: { isActive: boolean }) => (
    <View className="w-6 h-6">
      <Svg
        fill={isActive ? roleColors.primary : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
      </Svg>
    </View>
  );

  const HeartIcon = ({ isActive }: { isActive: boolean }) => (
    <View className="w-6 h-6">
      <Svg
        fill={isActive ? roleColors.primary : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </Svg>
    </View>
  );

  const PersonIcon = ({ isActive }: { isActive: boolean }) => (
    <View className="w-6 h-6">
      <Svg
        fill={isActive ? roleColors.primary : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
        />
      </Svg>
    </View>
  );

  // Dynamic tab data based on user role
  const getTabsForRole = () => {
    // For debugging: Let's show all tabs for now and see what role data we have
    const allTabs = [
      {
        id: "Home",
        label: "Home",
        isActive: activeTab === "home",
        icon: <HomeIcon isActive={activeTab === "home"} />,
      },
      {
        id: "Donate",
        label: "Donate",
        isActive: activeTab === "donate",
        icon: <DropIcon isActive={activeTab === "donate"} />,
      },
      {
        id: "Explore",
        label: "Explore",
        isActive: activeTab === "explore",
        icon: <SearchIcon isActive={activeTab === "explore"} />,
      },
      {
        id: "Activities",
        label: "Activities",
        isActive: activeTab === "activities",
        icon: <HeartIcon isActive={activeTab === "activities"} />,
      },
      {
        id: "Profile",
        label: "Account",
        isActive: activeTab === "account",
        icon: <PersonIcon isActive={activeTab === "account"} />,
      },
    ];

    // Debug what we're checking
    console.log("BottomTabBar - Full debug info:", {
      currentRole,
      canDonate: canDonate(),
      canVolunteer: canVolunteer(),
      canManageCampaigns: canManageCampaigns(),
      showingAllTabs: true
    });

    console.log("Generated tabs:", allTabs.map(tab => tab.label));
    return allTabs;
  };

  const tabs = getTabsForRole();

  return (
    <StyledView className="bg-white border-t border-gray-200 px-4 py-2">
      <StyledView className="flex-row justify-around items-center">
        {tabs.map((tab) => (
          <StyledTouchableOpacity
            key={tab.id}
            onPress={() => handleNavigation(tab.id)}
            className="flex-1 items-center py-2"
            activeOpacity={0.7}
          >
            <StyledView className="mb-1">{tab.icon}</StyledView>
            <StyledText
              className={`text-xs font-medium ${
                tab.isActive ? "text-gray-800" : "text-gray-600"
              }`}
              style={{
                color: tab.isActive ? roleColors.primary : "#6B7280"
              }}
            >
              {tab.label}
            </StyledText>
          </StyledTouchableOpacity>
        ))}
      </StyledView>

      {/* Bottom indicator with role-based color */}
      <StyledView
        className="h-1 rounded-full mt-2 mx-auto"
        style={{ 
          width: 134, 
          backgroundColor: roleColors.secondary
        }}
      />
    </StyledView>
  );
};

export default BottomTabBar;
