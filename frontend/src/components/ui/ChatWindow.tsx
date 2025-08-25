import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Package, Tag, Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface ChatWindowProps {
  isOpen: boolean;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onClose?: () => void;
  show_header?: boolean;
  onProductClick?: (productId: number) => void;
  onCategoryClick?: (categoryId: number) => void;
  onBrandClick?: (brandId: number) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  messages,
  onSendMessage,
  isLoading,
  onClose,
  show_header = true, // Default to true
  onProductClick,
  onCategoryClick,
  onBrandClick,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {

      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  // Cleanly define classes based on the show_header prop
  const baseClasses = 'bg-white flex flex-col overflow-hidden';
  const containerClasses = show_header
    ? `${baseClasses} fixed bottom-24 right-6 w-96 h-[600px] rounded-2xl shadow-2xl border border-gray-200 z-40`
    : `${baseClasses} w-full h-full`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={containerClasses}
        >
          {/* Header: Conditionally rendered */}
          {show_header && (
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Trợ lý AI</h3>
                  <p className="text-sm opacity-90">Hỗ trợ mua sắm 24/7</p>
                </div>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 p-1 rounded-full text-white/70 hover:bg-white/20 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.isUser ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm ${message.isUser ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-white text-gray-800 border'}`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
                    <p className={`text-xs mt-2 ${message.isUser ? 'text-white/70' : 'text-gray-500'}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="max-w-[80%]">
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-600 animate-pulse">AI đang trả lời...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWindow;

