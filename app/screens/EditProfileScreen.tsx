import React from "react";
import EditProfileScreenComponent from "./EditProfileScreen/screen";

interface EditProfileScreenProps {
  navigation?: any;
  onBack?: () => void;
  onClose?: () => void;
}

export default function EditProfileScreen(props: EditProfileScreenProps) {
  return <EditProfileScreenComponent {...props} />;
}
