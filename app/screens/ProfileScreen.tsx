import React from "react";
import ProfileScreenComponent from "./ProfileScreen/screen";

interface ProfileScreenProps {
  navigation?: any;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  return <ProfileScreenComponent navigation={navigation} />;
}
