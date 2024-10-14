import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const getChatHistory = async (senderId: string, recipientId: string) => {
  const response = await axios.get(`${API_BASE_URL}/chat/history`, {
    params: { senderId, recipientId },
  });
  return response.data;
};