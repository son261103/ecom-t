import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, MessageCircle, Sparkles, Package, Tag, Star } from 'lucide-react';
import { motion } from 'framer-motion';
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

export interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
  suggestedProducts?: ProductInfo[];
  suggestedCategories?: CategoryInfo[];
  suggestedBrands?: BrandInfo[];
}
import { chatService } from '../services/chatService';
import ChatWindow from '../components/ui/ChatWindow';
import toast from 'react-hot-toast';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>();
  const navigate = useNavigate();

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      message: 'Xin chào! Tôi là trợ lý AI của cửa hàng. Tôi có thể giúp bạn:\n\n• Tìm kiếm sản phẩm\n• Tư vấn mua sắm\n• Trả lời câu hỏi về sản phẩm\n• Hỗ trợ đặt hàng\n\nBạn có thể hỏi tôi bất cứ điều gì!',
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = useCallback(async (messageText: string) => {
    // Add user message immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponse = await chatService.sendMessage({
        message: messageText,
        conversationId,
      });

      // Add AI response
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: aiResponse.message,
        isUser: false,
        timestamp: new Date(aiResponse.timestamp),
        suggestedProducts: aiResponse.suggestedProducts,
        suggestedCategories: aiResponse.suggestedCategories,
        suggestedBrands: aiResponse.suggestedBrands,
      };

      setMessages(prev => [...prev, aiMessage]);
      setConversationId(aiResponse.conversationId);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      toast.error('Không thể gửi tin nhắn. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  const handleProductClick = useCallback((productId: number) => {
    navigate(`/products/${productId}`);
  }, [navigate]);

  const handleCategoryClick = useCallback((categoryId: number) => {
    navigate(`/products?category=${categoryId}`);
  }, [navigate]);

  const handleBrandClick = useCallback((brandId: number) => {
    navigate(`/products?brand=${brandId}`);
  }, [navigate]);

  return (
    <div className="flex justify-center items-center bg-gray-50 py-8">
      <div className="w-full h-[70vh] min-h-[500px] px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg border h-full overflow-hidden">
          <ChatWindow
            isOpen={true}
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            show_header={false} // Hide header on the main chat page
            onProductClick={handleProductClick}
            onCategoryClick={handleCategoryClick}
            onBrandClick={handleBrandClick}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
