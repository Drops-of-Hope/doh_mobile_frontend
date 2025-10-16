import React from "react";
import { Modal } from "react-native";
import AppointmentBookingForm from "../organisms/AppointmentBookingForm";

interface AppointmentBookingModalProps {
  visible: boolean;
  onClose: () => void;
  onBookAppointment: () => void;
}

export default function AppointmentBookingModal({
  visible,
  onClose,
  onBookAppointment,
}: AppointmentBookingModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <AppointmentBookingForm
        onClose={onClose}
        onBookingSuccess={onBookAppointment}
      />
    </Modal>
  );
}
