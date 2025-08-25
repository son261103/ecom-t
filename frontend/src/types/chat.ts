export interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
  suggestedProducts?: ProductInfo[];
  suggestedCategories?: CategoryInfo[];
  suggestedBrands?: BrandInfo[];
}

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
