// src/api/getTickets.ts
import api from "../../src/api/services/api";
import axios from 'axios';

const API_BASE_URL = 'https://travelmate-backend-0suw.onrender.com/api';

interface TicketData {
  title: string;
  category: string;
  description: string;
  priority?: string;
}

export const getTickets = async () => {
  try {
    const response = await api.get('/tickets/');
    console.log('[GET TICKETS] Success:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[GET TICKETS] Error:', error.response?.data || error.message);
    throw error;
  }
};

export const createTicket = async (ticketData: TicketData) => {
  try {
    const response = await api.post('/tickets/', ticketData);
    console.log('[CREATE TICKET] Success:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[CREATE TICKET] Error:', error.response?.data || error.message);
    throw error;
  }
};

export const getTicketById = async (id: number | string) => {
  try {
    const response = await api.get(`/tickets/${id}/`);
    console.log(`[GET TICKET ${id}] Success:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`[GET TICKET ${id}] Error:`, error.response?.data || error.message);
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

    const response = await axios.post(
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
  } catch (error: any) {
    console.error(
      `[REPLY TICKET ${ticketId}] Error:`,
      error.response?.data || error.message
    );
    throw error;
  }
};


export const deleteTicket = async (id: number) => {
  try {
    const res = await api.delete(`/tickets/${id}/`);
    return res.data;
  } catch (error) {
    console.error('Failed to delete ticket:', error);
    throw error;
  }
};
