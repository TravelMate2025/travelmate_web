// src/api/getTickets.ts
import axios from 'axios';

const API_BASE_URL = 'https://travelmate-backend-0suw.onrender.com/api';

interface TicketData {
  title: string;
  category: string;
  description: string;
  priority?: string;
}


export const getTickets = async (accessToken: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tickets/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('[GET TICKETS] Success:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[GET TICKETS] Error:', error.response?.data || error.message);
    throw error;
  }
};


export const createTicket = async (ticketData: TicketData, accessToken: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tickets/`, ticketData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('[CREATE TICKET] Success:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[CREATE TICKET] Error:', error.response?.data || error.message);
    throw error;
  }
};



export const getTicketById = async (id: number | string, accessToken: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tickets/${id}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
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




export const deleteTicket = async (id: string, accessToken: string) => {
  const response = await axios.delete(`/api/tickets/${id}/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

