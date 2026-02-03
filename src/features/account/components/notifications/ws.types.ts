export enum WsMessageType {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  ALERT = "alert",

  NEW_MESSAGE = "new_message",

  TICKET_RESOLVED = "ticket_resolved",
  TICKET_ESCALATED = "ticket_escalated",

  BOOKING_UPDATE = "booking_update",
  BOOKING_REMINDER = "booking_reminder",
  SCHEDULE_CHANGE = "schedule_change",

  MARKETING_AND_PROMOTIONAL = "marketing_and_promotional",
  NEWS_AND_UPDATES = "news_and_updates"
}
