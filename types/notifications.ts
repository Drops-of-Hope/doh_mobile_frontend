export type NotificationType =
  | "emergency"
  | "campaign"
  | "appointment"
  | "reminder"
  | "achievement";

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: "high" | "medium" | "low";
  actionRequired?: boolean;
}
