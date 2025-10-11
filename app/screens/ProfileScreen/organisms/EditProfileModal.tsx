import React from "react";
import { Modal } from "react-native";
import EditProfileScreen from "../../EditProfileScreen/screen";

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function EditProfileModal({
  visible,
  onClose,
}: EditProfileModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <EditProfileScreen onClose={onClose} />
    </Modal>
  );
}
