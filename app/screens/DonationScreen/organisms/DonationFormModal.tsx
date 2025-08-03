import React from "react";
import { Modal } from "react-native";
import DonationForm from "../../../../components/organisms/DonationForm";

interface DonationFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function DonationFormModal({
  visible,
  onClose,
  onSubmit,
}: DonationFormModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <DonationForm />
    </Modal>
  );
}
