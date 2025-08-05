import React from "react";
import { Modal } from "react-native";
import FAQsScreen from "../../FAQsScreen";

interface FAQModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function FAQModal({ visible, onClose }: FAQModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <FAQsScreen onBack={onClose} />
    </Modal>
  );
}
