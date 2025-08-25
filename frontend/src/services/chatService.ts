import api from './api';

// Bypassing module import due to a persistent caching issue.
// Defining types directly in the file.

export interface ProductInfo {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
  categoryName: string;
  brandName: string;
}

export interface CategoryInfo {
  id: number;
  name: string;
}

export interface BrandInfo {
  id: number;
  name: string;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface ChatResponse {
  message: string;
  conversationId: string;
  timestamp: string;
  suggestedProducts: ProductInfo[];
  suggestedCategories: CategoryInfo[];
  suggestedBrands: BrandInfo[];
}

class ChatService {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await api.post<ChatResponse>('/chat/message', request);
    return response;
  }

  async checkHealth(): Promise<string> {
    const response = await api.get<string>('/chat/health');
    return response;
  }
}

export const chatService = new ChatService();
export default chatService;
