import api from './api';
import { ChatRoom, ChatMessage } from '@/types';

export const chatService = {
  async getRooms(): Promise<ChatRoom[]> {
    const response = await api.get('/chat/');
    return response.data.results ?? response.data;
  },

  async createRoom(data: { name: string; type: string; participants: string[] }): Promise<ChatRoom> {
    const response = await api.post('/chat/create/', data);
    return response.data;
  },

  async getMessages(roomId: string, limit = 50, offset = 0): Promise<ChatMessage[]> {
    const response = await api.get(`/chat/${roomId}/messages/`, {
      params: { limit, offset }
    });
    return response.data.results ?? response.data;
  },

  async sendMessage(roomId: string, content: string): Promise<ChatMessage> {
    const response = await api.post(`/chat/${roomId}/send/`, { content });
    return response.data;
  },
};
