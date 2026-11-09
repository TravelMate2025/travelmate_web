
  export type UserInfo = SenderInfo;
  
  
  export interface LastMessage {
    content: string;
    sender: SenderInfo;
    created_at: string;
  }

  export interface SenderInfo {
    id: number;
    email: string;
    first_name: string;
    last_name?: string | null;
    profileImage?: string | null;
  }
  
export interface Message {
  sender_info?: SenderInfo;
    file_type?: string | null;
    id?: number;
    content: string;
    sender: string;
    timestamp: string;
    pending?: boolean;
    first_name?: string;
    file_url?: string; 
    file_name?: string;
  }
  

  export interface ClaimHistoryItem {
  note: string;
  id: number | string;
  claim_note_text: string;
  timestamp: string; 
}

  
  export interface Chat {
    id: number;
    title?: string;
    status?: string;
    messages: Message[];
    assigned_admin_info?: UserInfo;
    user_info?: UserInfo;
    admin_name?: string;
    last_message?: LastMessage | null;
    claim_history?: ClaimHistoryItem[];
    systemMessageText?: string;
    // Set locally from a live `session_update` WebSocket event when an
    // admin claims this chat while it's already open — distinct from
    // `assigned_admin_info`, which only ever comes from the initial REST
    // fetch. The live broadcast doesn't carry `email`, so it can't be
    // merged into `assigned_admin_info`'s shape; this is a separate,
    // ephemeral, display-only field.
    liveAdminJoinedName?: string;
  }
  
