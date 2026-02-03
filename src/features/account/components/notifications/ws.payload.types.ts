// notifications/ws.payload.types.ts

export interface WsNotificationDetails {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  category: string;
  source_app: string;
  link: string;
  created_at: string;
}

export interface WsNotificationData {
  id: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  notification_details: WsNotificationDetails;
}

export interface WsNotificationMessage {
  event: "notification.created";
  data: WsNotificationData;
}
