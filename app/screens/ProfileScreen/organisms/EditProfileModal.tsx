import React from "react";
import { Modal } from "react-native";
import EditProfileScreen from "../../EditProfileScreen";

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
