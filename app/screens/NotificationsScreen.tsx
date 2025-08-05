import React from "react";
import NotificationsScreenComponent from "./NotificationsScreen/NotificationsScreen";

interface NotificationsScreenProps {
  navigation?: any;
}

export default function NotificationsScreen(props: NotificationsScreenProps) {
  return <NotificationsScreenComponent {...props} />;
}
