import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Eye, 
  Search, 
  Filter,
  ChevronRight,
  TrendingUp,
  MessageCircle,
  Share2,
} from 'lucide-react';
import { Card, Button, Input } from '../components/ui';
import { ROUTES } from '../utils/constants';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  publishDate: string;
  readTime: string;
  views: number;
  comments: number;
  category: string;
  tags: string[];
  featured: boolean;
}

const NewsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data - trong thực tế sẽ fetch từ API
  const newsArticles: NewsArticle[] = [
    {
      id: '1',
      title: 'iPhone 15 Pro Max: Đánh giá chi tiết sau 3 tháng sử dụng',
      excerpt: 'Sau 3 tháng trải nghiệm thực tế, iPhone 15 Pro Max có thực sự xứng đáng với mức giá cao? Hãy cùng tìm hiểu những ưu nhược điểm của chiếc flagship mới nhất từ Apple.',
      content: '',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author: 'Nguyễn Văn Tech',
      publishDate: '2024-08-20',
      readTime: '8 phút đọc',
      views: 15420,
      comments: 89,
      category: 'Smartphone',
      tags: ['iPhone', 'Apple', 'Review', 'Flagship'],
      featured: true,
    },
    {
      id: '2',
      title: 'Top 5 laptop gaming tốt nhất trong tầm giá 30 triệu',
      excerpt: 'Bạn đang tìm kiếm một chiếc laptop gaming mạnh mẽ với ngân sách 30 triệu? Đây là những lựa chọn tốt nhất hiện tại trên thị trường.',
      content: '',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author: 'Trần Gaming Pro',
      publishDate: '2024-08-18',
      readTime: '12 phút đọc',
      views: 8930,
      comments: 45,
      category: 'Laptop',
      tags: ['Gaming', 'Laptop', 'Review', 'Budget'],
      featured: true,
    },
    {
      id: '3',
      title: 'Tai nghe Sony WH-1000XM5: Có đáng để nâng cấp?',
      excerpt: 'Sony vừa ra mắt phiên bản mới của dòng tai nghe chống ồn hàng đầu. Liệu WH-1000XM5 có những cải tiến đáng kể so với thế hệ trước?',
      content: '',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author: 'Lê Audio Master',
      publishDate: '2024-08-15',
      readTime: '6 phút đọc',
      views: 12350,
      comments: 67,
      category: 'Audio',
      tags: ['Sony', 'Headphones', 'Review', 'Audio'],
      featured: false,
    },
    {
      id: '4',
      title: 'Xu hướng công nghệ 2024: AI và IoT dẫn đầu',
      excerpt: 'Năm 2024 đánh dấu bước ngoặt quan trọng trong ngành công nghệ với sự bùng nổ của AI và IoT. Những xu hướng nào sẽ định hình tương lai?',
      content: '',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author: 'Phạm Tech Insight',
      publishDate: '2024-08-12',
      readTime: '10 phút đọc',
      views: 6780,
      comments: 23,
      category: 'Technology',
      tags: ['AI', 'IoT', 'Trend', '2024'],
      featured: false,
    },
    {
      id: '5',
      title: 'Hướng dẫn chọn mua smartwatch phù hợp',
      excerpt: 'Với hàng trăm mẫu smartwatch trên thị trường, làm sao để chọn được chiếc phù hợp nhất? Đây là hướng dẫn chi tiết từ A-Z.',
      content: '',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author: 'Hoàng Wearable',
      publishDate: '2024-08-10',
      readTime: '7 phút đọc',
      views: 9240,
      comments: 34,
      category: 'Wearable',
      tags: ['Smartwatch', 'Guide', 'Buying'],
      featured: false,
    },
    {
      id: '6',
      title: 'MacBook Air M3 vs MacBook Pro M3: Nên chọn máy nào?',
      excerpt: 'Apple vừa ra mắt chip M3 mới cho dòng MacBook. So sánh chi tiết giữa Air và Pro để tìm ra lựa chọn phù hợp nhất.',
      content: '',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author: 'Nguyễn Mac Expert',
      publishDate: '2024-08-08',
      readTime: '9 phút đọc',
      views: 11560,
      comments: 78,
      category: 'Laptop',
      tags: ['MacBook', 'Apple', 'M3', 'Comparison'],
      featured: false,
    },
  ];

  const categories = [
    { id: 'all', name: 'Tất cả', count: newsArticles.length },
    { id: 'Smartphone', name: 'Smartphone', count: newsArticles.filter(a => a.category === 'Smartphone').length },
    { id: 'Laptop', name: 'Laptop', count: newsArticles.filter(a => a.category === 'Laptop').length },
    { id: 'Audio', name: 'Audio', count: newsArticles.filter(a => a.category === 'Audio').length },
    { id: 'Technology', name: 'Công nghệ', count: newsArticles.filter(a => a.category === 'Technology').length },
    { id: 'Wearable', name: 'Thiết bị đeo', count: newsArticles.filter(a => a.category === 'Wearable').length },
  ];

  // Filter articles
  const filteredArticles = newsArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = filteredArticles.filter(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-4">
            Tin tức <span className="text-gradient">Công nghệ</span>
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Cập nhật những tin tức mới nhất về công nghệ, đánh giá sản phẩm và hướng dẫn chi tiết
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
          data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="1000"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="1000"
          >
            <div className="flex items-center mb-6">
              <TrendingUp className="w-6 h-6 text-primary-600 mr-2" />
              <h2 className="text-2xl font-bold text-secondary-900">Bài viết nổi bật</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  data-aos="fade-up"
                  data-aos-delay={300 + index * 100}
                  data-aos-duration="800"
                >
                  <FeaturedArticleCard article={article} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Regular Articles */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          data-aos="fade-up"
          data-aos-delay="400"
          data-aos-duration="1000"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-secondary-900">Tất cả bài viết</h2>
            <span className="text-secondary-600">
              {filteredArticles.length} bài viết
            </span>
          </div>

          {regularArticles.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Không tìm thấy bài viết
              </h3>
              <p className="text-secondary-600">
                {searchQuery 
                  ? `Không có bài viết nào phù hợp với "${searchQuery}"`
                  : 'Không có bài viết nào trong danh mục này'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  data-aos="fade-up"
                  data-aos-delay={500 + index * 100}
                  data-aos-duration="800"
                >
                  <ArticleCard article={article} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

// Featured Article Card Component
interface ArticleCardProps {
  article: NewsArticle;
}

const FeaturedArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <Link to={`${ROUTES.NEWS}/${article.id}`}>
      <Card className="group cursor-pointer h-full overflow-hidden" hover>
        <div className="relative">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Nổi bật
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center text-sm text-secondary-500 mb-3">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDate(article.publishDate)}</span>
            <span className="mx-2">•</span>
            <Clock className="w-4 h-4 mr-1" />
            <span>{article.readTime}</span>
            <span className="mx-2">•</span>
            <Eye className="w-4 h-4 mr-1" />
            <span>{formatViews(article.views)}</span>
          </div>
          
          <h3 className="font-bold text-xl text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2">
            {article.title}
          </h3>
          
          <p className="text-secondary-600 mb-4 line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="w-4 h-4 text-secondary-400 mr-2" />
              <span className="text-sm text-secondary-600">{article.author}</span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-secondary-500">
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                <span>{article.comments}</span>
              </div>
              <Share2 className="w-4 h-4 hover:text-primary-600 transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

// Regular Article Card Component
const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <Link to={`${ROUTES.NEWS}/${article.id}`}>
      <Card className="group cursor-pointer h-full overflow-hidden" hover>
        <div className="relative">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center text-sm text-secondary-500 mb-3">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDate(article.publishDate)}</span>
            <span className="mx-2">•</span>
            <Clock className="w-4 h-4 mr-1" />
            <span>{article.readTime}</span>
          </div>
          
          <h3 className="font-bold text-lg text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2">
            {article.title}
          </h3>
          
          <p className="text-secondary-600 mb-4 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="w-4 h-4 text-secondary-400 mr-2" />
              <span className="text-sm text-secondary-600">{article.author}</span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-secondary-500">
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                <span>{formatViews(article.views)}</span>
              </div>
              <ChevronRight className="w-4 h-4 group-hover:text-primary-600 transition-colors" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default NewsPage;
