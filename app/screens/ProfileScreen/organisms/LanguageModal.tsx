import React from "react";
import { Modal } from "react-native";
import LanguageSelectionScreen from "../../LanguageSelectionScreen";

interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function LanguageModal({
  visible,
  onClose,
}: LanguageModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <LanguageSelectionScreen onClose={onClose} />
    </Modal>
  );
}
