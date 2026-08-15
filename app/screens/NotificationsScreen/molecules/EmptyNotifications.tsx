import React from "react";
import { BellOff } from "lucide-react-native";
import { EmptyState } from "../../../design";

interface EmptyNotificationsProps {
  title?: string;
  message?: string;
}

export default function EmptyNotifications({
  title = "No Notifications",
  message = "You're all caught up! We'll notify you when there's something new.",
}: EmptyNotificationsProps) {
  return <EmptyState icon={BellOff} title={title} body={message} />;
}
