
import api from "../../../api/services/api";
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface TicketSummary {
  id: number;
  ticket_id: string;
  title: string;
  category: string;
  status: "pending" | "resolved" | string;
  created_at: string;
  description: string;
}

export interface TicketListResponse {
  results: TicketSummary[];
}

export interface TicketDetail {
  id: number;
  ticket_id: number | string;
  title: string;
  category: string;
  description: string;
  status: "pending" | "resolved" | string;
  created_at: string;
  updated_at: string;
  messages: Array<{
    created_at: string;
    id: number;
    sender: { email: string };
    content: string;
    attachment?: string | null;
    timestamp?: string;
  }>;
  user: {
    id: number;
    email: string;
    first_name: string | null;
    last_name: string | null;
  };
  escalated: boolean;
  escalated_at: string | null;
  escalated_by: string | null;
  escalation_note: string;
  escalation_note_text: string;
  escalation_reason: string;
  escalation_response_time: string;
  escalation_role: {
    id: number;
    name: string;
    description: string;
  };
  claimed_admin: string | null;
  claim_timestamp: string | null;
  claim_note_text: string | null;
  claim_history: Array<{
    id: number;
    claimed_admin: {
      id: number;
      email: string;
      first_name: string;
      last_name: string;
    };
    timestamp: string;
    claim_note_text: string;
  }>;
  escalation_history: Array<{
    id: number;
    escalated_by: {
      id: number;
      email: string;
      first_name: string;
      last_name: string;
      mobile_number: string;
    };
    escalation_note_text: string;
    escalation_role: {
      id: number;
      name: string;
      description: string;
    };
    reason: string;
    note: string;
    timestamp: string;
  }>;
}

interface TicketData {
  title: string;
  category: string;
  description: string;
}

const axiosErrMsg = (error: unknown) =>
  axios.isAxiosError(error)
    ? (typeof error.response?.data === "string"
        ? error.response.data
        : error.message)
    : String(error);

export const getTickets = async (): Promise<TicketListResponse> => {
  try {
    const response = await api.get<TicketListResponse>('/tickets/');
    console.log('[GET TICKETS] Success:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('[GET TICKETS] Error:', axiosErrMsg(error));
    throw error;
  }
};

export const createTicket = async (ticketData: TicketData) => {
  try {
    const response = await api.post<TicketDetail>('/tickets/', ticketData);
    console.log('[CREATE TICKET] Success:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('[CREATE TICKET] Error:', axiosErrMsg(error));
    throw error;
  }
};

export const getTicketById = async (id: number | string): Promise<TicketDetail> => {
  try {
    const response = await api.get<TicketDetail>(`/tickets/${id}/`);
    console.log(`[GET TICKET ${id}] Success:`, response.data);
    return response.data;
  } catch (error: unknown) {
    console.error(`[GET TICKET ${id}] Error:`, axiosErrMsg(error));
    throw error;
  }
};

export const replyToTicket = async (
  ticketId: number | string,
  message: string,
  accessToken: string,
  attachment?: File | null
) => {
  try {
    const formData = new FormData();
    formData.append("content", message);
    if (attachment) {
      formData.append("attachment", attachment);
    }

    const response = await axios.post<TicketDetail>(
      `${API_BASE_URL}/tickets/${ticketId}/messages/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(`[REPLY TICKET ${ticketId}] Success:`, response.data);
    return response.data;
  } catch (error: unknown) {
    console.error(`[REPLY TICKET ${ticketId}] Error:`, axiosErrMsg(error));
    throw error;
  }
};


export const deleteTicket = async (id: number) => {
  try {
    const res = await api.delete<unknown>(`/tickets/${id}/`);
    return res.data;
  } catch (error: unknown) {
    console.error('Failed to delete ticket:', error);
    throw error;
  }
};
