export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type MessageSenderType = "USER" | "ADMIN";

export interface TicketMessage {
  id: number;
  uid: string;
  ticketUid: string;
  senderUid: string;
  senderType: MessageSenderType;
  message: string;
  attachments?: string[];
  createdAt: string;
}

interface User {
  email: string;
  image?: string | null;
  username: string;
  fullName?: string | null;
}

export interface SupportTicket {
  id: number;
  uid: string;
  subject: string;
  description?: string | null;
  shopId: number;
  userUid: string;
  shopScopedId: number;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
  user: User;
}

export interface SupportTicketPublic
  extends Omit<SupportTicket, "shopId" | "userUid" | "messages"> {
  messages: {
    senderType: MessageSenderType;
    message: string;
    createdAt: string;
  }[];
}
