import React from "react";
import { Modal } from "react-native";
import QRDisplay from "../../shared/atoms/Donation/QRDisplay";
import { UserProfile } from "../types";

interface QRModalProps {
  visible: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onSuccess?: () => void;
}

export default function QRModal({
  visible,
  onClose,
  userProfile,
  onSuccess,
}: QRModalProps) {
  if (!userProfile) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <QRDisplay
        userName={userProfile.name}
        userEmail={userProfile.email || ""}
        userUID={userProfile.id}
        onClose={onClose}
      />
    </Modal>
  );
}
