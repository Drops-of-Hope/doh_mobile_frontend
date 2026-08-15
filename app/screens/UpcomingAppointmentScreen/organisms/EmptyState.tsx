import React from "react";
import { CalendarX } from "lucide-react-native";
import { EmptyState as DesignEmptyState } from "../../../design";
import { EmptyStateProps } from "../types";

export default function EmptyState({ onBookAppointment }: EmptyStateProps) {
  return (
    <DesignEmptyState
      icon={CalendarX}
      title="No Appointments"
      body="You don't have any appointments scheduled. Book your first appointment to get started!"
      actionLabel={onBookAppointment ? "Book Appointment" : undefined}
      onAction={onBookAppointment}
    />
  );
}
