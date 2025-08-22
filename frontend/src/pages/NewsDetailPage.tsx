import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  Eye,
  MessageCircle,
  Share2,
  ArrowLeft,
  Tag,
  ChevronRight,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
} from 'lucide-react';
import { Card, Button } from '../components/ui';
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

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock data - trong thực tế sẽ fetch từ API dựa trên id
  const article: NewsArticle = {
    id: id || '1',
    title: 'iPhone 15 Pro Max: Đánh giá chi tiết sau 3 tháng sử dụng',
    excerpt: 'Sau 3 tháng trải nghiệm thực tế, iPhone 15 Pro Max có thực sự xứng đáng với mức giá cao? Hãy cùng tìm hiểu những ưu nhược điểm của chiếc flagship mới nhất từ Apple.',
    content: `
      <h2>Thiết kế và chất lượng xây dựng</h2>
      <p>iPhone 15 Pro Max mang đến một thiết kế tinh tế với khung titan cực kỳ bền bỉ. Việc chuyển từ thép không gỉ sang titan không chỉ giúp máy nhẹ hơn mà còn tăng độ bền vượt trội.</p>
      
      <p>Mặt lưng kính mờ giúp hạn chế bám vân tay, trong khi các cạnh được bo tròn mềm mại tạo cảm giác cầm nắm thoải mái hơn so với thế hệ trước.</p>

      <h2>Hiệu năng và chip A17 Pro</h2>
      <p>Chip A17 Pro được sản xuất trên tiến trình 3nm mang lại hiệu năng vượt trội. Trong các tác vụ hàng ngày như lướt web, xem video, chơi game, máy hoạt động mượt mà không có dấu hiệu lag hay giật.</p>
      
      <p>Đặc biệt, khả năng xử lý đồ họa được cải thiện đáng kể, giúp các game AAA chạy ở mức 60fps ổn định với chất lượng hình ảnh cao.</p>

      <h2>Camera và chất lượng ảnh</h2>
      <p>Hệ thống camera trên iPhone 15 Pro Max thực sự ấn tượng với camera chính 48MP và khả năng zoom quang học 5x. Chất lượng ảnh trong điều kiện ánh sáng tốt rất sắc nét với màu sắc tự nhiên.</p>
      
      <p>Tính năng Action Button thay thế switch im lặng truyền thống, có thể tùy chỉnh để thực hiện nhiều tác vụ khác nhau như mở camera, bật đèn pin, hoặc kích hoạt Shortcuts.</p>

      <h2>Pin và thời lượng sử dụng</h2>
      <p>Với việc sử dụng hàng ngày bao gồm gọi điện, nhắn tin, lướt mạng xã hội, xem video và chơi game nhẹ, iPhone 15 Pro Max có thể kéo dài từ sáng đến tối mà không cần sạc.</p>
      
      <p>Tính năng sạc không dây MagSafe và sạc nhanh qua USB-C giúp việc sạc pin trở nên tiện lợi hơn bao giờ hết.</p>

      <h2>Kết luận</h2>
      <p>Sau 3 tháng sử dụng, iPhone 15 Pro Max thực sự là một chiếc smartphone đáng đầu tư. Mặc dù giá thành cao nhưng chất lượng, hiệu năng và trải nghiệm người dùng hoàn toàn xứng đáng.</p>
      
      <p>Nếu bạn đang tìm kiếm một chiếc flagship Android với hiệu năng tốt nhất hiện tại, iPhone 15 Pro Max chắc chắn là lựa chọn hàng đầu.</p>
    `,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    author: 'Nguyễn Văn Tech',
    publishDate: '2024-08-20',
    readTime: '8 phút đọc',
    views: 15420,
    comments: 89,
    category: 'Smartphone',
    tags: ['iPhone', 'Apple', 'Review', 'Flagship'],
    featured: true,
  };

  // Related articles
  const relatedArticles = [
    {
      id: '2',
      title: 'Top 5 laptop gaming tốt nhất trong tầm giá 30 triệu',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      publishDate: '2024-08-18',
      readTime: '12 phút đọc',
    },
    {
      id: '3',
      title: 'Tai nghe Sony WH-1000XM5: Có đáng để nâng cấp?',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      publishDate: '2024-08-15',
      readTime: '6 phút đọc',
    },
    {
      id: '4',
      title: 'Xu hướng công nghệ 2024: AI và IoT dẫn đầu',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      publishDate: '2024-08-12',
      readTime: '10 phút đọc',
    },
  ];

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

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = article.title;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        // Có thể thêm toast notification ở đây
        break;
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center text-sm text-secondary-600 mb-8"
          data-aos="fade-down"
          data-aos-duration="800"
        >
          <Link to={ROUTES.HOME} className="hover:text-primary-600 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link to={ROUTES.NEWS} className="hover:text-primary-600 transition-colors">
            Tin tức
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-secondary-900 font-medium">Chi tiết bài viết</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
              data-aos="fade-right"
              data-aos-duration="800"
            >
              <Button
                variant="outline"
                size="sm"
                icon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => navigate(-1)}
              >
                Quay lại
              </Button>
            </motion.div>

            {/* Article Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                  {article.category}
                </span>
                {article.featured && (
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    Nổi bật
                  </span>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-display font-bold text-secondary-900 mb-6 leading-tight">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-secondary-600 mb-6">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{formatDate(article.publishDate)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{article.readTime}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  <span>{formatViews(article.views)} lượt xem</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span>{article.comments} bình luận</span>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-secondary-700">Chia sẻ:</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShare('facebook')}
                    className="p-2"
                  >
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShare('twitter')}
                    className="p-2"
                  >
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShare('linkedin')}
                    className="p-2"
                  >
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShare('copy')}
                    className="p-2"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
              data-aos="zoom-in"
              data-aos-duration="1000"
              data-aos-delay="200"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </motion.div>

            {/* Article Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="300"
            >
              <Card className="prose prose-lg max-w-none">
                <div 
                  className="text-secondary-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </Card>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8"
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="400"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-secondary-600" />
                <span className="text-sm font-medium text-secondary-700">Tags:</span>
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm hover:bg-primary-100 hover:text-primary-700 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Related Articles */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              data-aos="fade-left"
              data-aos-duration="1000"
              data-aos-delay="500"
            >
              <Card>
                <h3 className="text-xl font-bold text-secondary-900 mb-6">Bài viết liên quan</h3>
                <div className="space-y-6">
                  {relatedArticles.map((relatedArticle) => (
                    <Link
                      key={relatedArticle.id}
                      to={`${ROUTES.NEWS}/${relatedArticle.id}`}
                      className="block group"
                    >
                      <div className="flex gap-4">
                        <img
                          src={relatedArticle.image}
                          alt={relatedArticle.title}
                          className="w-20 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-secondary-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 mb-2">
                            {relatedArticle.title}
                          </h4>
                          <div className="flex items-center text-xs text-secondary-500 gap-2">
                            <span>{formatDate(relatedArticle.publishDate)}</span>
                            <span>•</span>
                            <span>{relatedArticle.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;
