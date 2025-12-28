import { WsMessageType } from "./ws.types";
import { NotificationCategory } from "./category.types";

export interface Notification {
  /** Recipient ID */
  id: string;

  title: string;
  message: string;

  /** Event meaning */
  type: WsMessageType;

  /** UI grouping */
  category: NotificationCategory;

  /** Deep link */
  link?: string;

  /** Metadata */
  sourceApp?: string;

  createdAt: string;
  isRead: boolean;
  readAt?: string | null;
}
