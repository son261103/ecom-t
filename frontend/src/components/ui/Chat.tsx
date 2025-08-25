import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ChatIcon from './ChatIcon';
import ChatWindow from './ChatWindow';
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
import { chatService } from '../../services/chatService';
import toast from 'react-hot-toast';

const Chat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>();
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show the floating chat on the dedicated chat page
  const isChatPage = location.pathname === '/chat';

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

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
      const response = await chatService.sendMessage({
        message: messageText,
        conversationId,
      });

      // Add AI response
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: response.message,
        isUser: false,
        timestamp: new Date(response.timestamp),
        suggestedProducts: response.suggestedProducts,
        suggestedCategories: response.suggestedCategories,
        suggestedBrands: response.suggestedBrands,
      };

      setMessages(prev => [...prev, aiMessage]);
      setConversationId(response.conversationId);
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
    setIsOpen(false);
  }, [navigate]);

  const handleCategoryClick = useCallback((categoryId: number) => {
    navigate(`/products?category=${categoryId}`);
    setIsOpen(false);
  }, [navigate]);

  const handleBrandClick = useCallback((brandId: number) => {
    navigate(`/products?brand=${brandId}`);
    setIsOpen(false);
  }, [navigate]);

  return (
    <>
      {!isChatPage && (
        <>
          <ChatIcon
            isOpen={isOpen}
            onClick={toggleChat}
            hasUnreadMessages={false}
          />
          <ChatWindow
            isOpen={isOpen}
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onClose={toggleChat}
            onProductClick={handleProductClick}
            onCategoryClick={handleCategoryClick}
            onBrandClick={handleBrandClick}
          />
        </>
      )}
    </>
  );
};

export default Chat;
