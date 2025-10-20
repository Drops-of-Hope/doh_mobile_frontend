import React from "react";
import { Modal } from "react-native";
import DonationForm from "../../shared/organisms/DonationForm";

interface DonationFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  appointmentId?: string;
}

export default function DonationFormModal({
  visible,
  onClose,
  onSubmit,
  appointmentId,
}: DonationFormModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <DonationForm 
        onSubmitSuccess={onSubmit} 
        appointmentId={appointmentId}
      />
    </Modal>
  );
}
