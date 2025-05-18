// types/chat.ts

export interface UserInfo {
    id?: number;
    first_name?: string;
    last_name?: string;
    profile_pics?: string;
    email?: string;
  }
  
  export interface SenderInfo {
    first_name: string;
    last_name: string;
    profile_pics: string;
  }
  
  export interface LastMessage {
    content: string;
    sender: SenderInfo;
    created_at: string;
  }
  
  export interface Message {
    file_type: any;
    id?: number;
    content: string;
    sender: string;
    timestamp: string;
    pending?: boolean;
    first_name?: string;
    file_url?: string; 
    file_name?: string;
  }
  
  export interface Chat {
    id: number;
    title?: string;
    status?: string;
    messages: Message[];
    admin_info?: UserInfo | null;
    user_info?: UserInfo | null;
    admin_name?: string;
    last_message?: LastMessage | null;
  }
  