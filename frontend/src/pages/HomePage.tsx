import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ShoppingCart,
  Truck,
  Shield,
  Headphones,
  Award,
  Zap,
  Users,
  Globe,
  CheckCircle,
  Smartphone,
  Laptop,
  Headset,
  Watch,
  Play,
  TrendingUp,
  Star,
} from 'lucide-react';
import { Card, Button } from '../components/ui';
import { ROUTES } from '../utils/constants';

const HomePage: React.FC = () => {

  const features = [
    {
      icon: Truck,
      title: 'Miễn phí vận chuyển',
      description: 'Cho đơn hàng từ 500.000đ',
    },
    {
      icon: Shield,
      title: 'Bảo hành chính hãng',
      description: 'Bảo hành tại các trung tâm ủy quyền',
    },
    {
      icon: Headphones,
      title: 'Hỗ trợ 24/7',
      description: 'Tư vấn và hỗ trợ mọi lúc',
    },
    {
      icon: Award,
      title: 'Chất lượng đảm bảo',
      description: 'Sản phẩm chính hãng 100%',
    },
  ];

  const services = [
    {
      icon: Zap,
      title: 'Công nghệ tiên tiến',
      description: 'Sản phẩm với công nghệ mới nhất',
      color: 'from-yellow-500 to-orange-600',
    },
    {
      icon: Shield,
      title: 'Bảo mật tuyệt đối',
      description: 'An toàn thông tin 100%',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: Users,
      title: 'Cộng đồng lớn',
      description: 'Hơn 50,000 khách hàng tin tưởng',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Globe,
      title: 'Phục vụ toàn quốc',
      description: 'Giao hàng nhanh chóng mọi nơi',
      color: 'from-purple-500 to-pink-600',
    },
  ];

  const testimonials = [
    {
      name: 'Nguyễn Văn A',
      role: 'CEO Công ty ABC',
      content: 'Sản phẩm chất lượng tuyệt vời, dịch vụ hỗ trợ nhiệt tình. Tôi rất hài lòng với Electro.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      rating: 5,
    },
    {
      name: 'Trần Thị B',
      role: 'Freelancer',
      content: 'Mua laptop tại đây được 2 năm rồi, vẫn hoạt động tốt. Giá cả hợp lý, chất lượng đảm bảo.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      rating: 5,
    },
    {
      name: 'Lê Minh C',
      role: 'Sinh viên',
      content: 'Nhân viên tư vấn rất chuyên nghiệp, giúp tôi chọn được chiếc điện thoại phù hợp nhất.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      rating: 5,
    },
  ];

  const blogPosts = [
    {
      title: 'Top 10 smartphone đáng mua nhất 2024',
      excerpt: 'Khám phá những chiếc smartphone có hiệu năng tốt nhất và giá cả hợp lý trong năm 2024.',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      date: '15 Tháng 8, 2024',
      readTime: '5 phút đọc',
    },
    {
      title: 'Hướng dẫn chọn laptop phù hợp',
      excerpt: 'Những tiêu chí quan trọng khi chọn mua laptop cho công việc và giải trí.',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      date: '12 Tháng 8, 2024',
      readTime: '7 phút đọc',
    },
    {
      title: 'Tai nghe không dây: Xu hướng mới',
      excerpt: 'Tại sao tai nghe không dây đang trở thành lựa chọn hàng đầu của người tiêu dùng.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      date: '10 Tháng 8, 2024',
      readTime: '4 phút đọc',
    },
  ];

  const stats = [
    {
      icon: Users,
      number: '50K+',
      label: 'Khách hàng tin tưởng',
    },
    {
      icon: CheckCircle,
      number: '99%',
      label: 'Khách hàng hài lòng',
    },
    {
      icon: Globe,
      number: '24/7',
      label: 'Hỗ trợ trực tuyến',
    },
    {
      icon: TrendingUp,
      number: '5 năm',
      label: 'Kinh nghiệm',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-primary-100 to-secondary-50 py-20 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-6"
              >
                <Zap className="w-4 h-4 mr-2" />
                Công nghệ mới nhất 2024
              </motion.div>

              <h1 className="text-5xl lg:text-7xl font-display font-bold text-secondary-900 mb-6 leading-tight">
                Công nghệ
                <span className="text-gradient block">
                  Tương lai
                </span>
                <span className="text-primary-600">Trong tầm tay</span>
              </h1>

              <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
                Khám phá bộ sưu tập đồ điện tử cao cấp với công nghệ tiên tiến nhất.
                Từ smartphone đến laptop, chúng tôi mang đến những sản phẩm tốt nhất
                với giá cả hợp lý và dịch vụ tuyệt vời.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to={ROUTES.PRODUCTS}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="lg" icon={<ShoppingCart className="w-5 h-5" />} className="w-full sm:w-auto">
                      Mua sắm ngay
                    </Button>
                  </motion.div>
                </Link>
                <Link to={ROUTES.NEWS}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" size="lg" icon={<Play className="w-4 h-4" />} className="w-full sm:w-auto">
                      Đọc tin tức
                    </Button>
                  </motion.div>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                      data-aos="fade-up"
                      data-aos-delay={400 + index * 100}
                      className="text-center"
                    >
                      <Icon className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-secondary-900">{stat.number}</div>
                      <div className="text-sm text-secondary-600">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              data-aos="fade-left"
              data-aos-duration="1000"
              data-aos-delay="200"
              className="relative"
            >
              <div className="relative z-10">
                <motion.img
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.4 }}
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Electronics"
                  className="w-full h-auto rounded-3xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl opacity-20"></div>
              <div className="absolute -bottom-6 -left-6 w-full h-full bg-gradient-to-tr from-purple-400 to-pink-400 rounded-3xl opacity-15"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            data-aos="fade-up"
            data-aos-duration="1000"
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-secondary-900 mb-6">
              Tại sao chọn <span className="text-gradient">Electro</span>?
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Chúng tôi cam kết mang đến trải nghiệm mua sắm tuyệt vời nhất với những dịch vụ chất lượng cao
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  data-aos-duration="800"
                >
                  <Card className="text-center h-full group" hover>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow duration-300"
                    >
                      <Icon className="w-8 h-8 text-primary-600" />
                    </motion.div>
                    <h3 className="font-bold text-lg text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-secondary-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            data-aos="fade-up"
            data-aos-duration="1000"
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-secondary-900 mb-6">
              Dịch vụ <span className="text-gradient">đặc biệt</span>
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Những dịch vụ và giá trị mà chúng tôi mang lại cho khách hàng
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  data-aos-duration="800"
                >
                  <Card className="group cursor-pointer h-full overflow-hidden" hover>
                    <div className={`bg-gradient-to-br ${service.color} p-6 text-white relative`}>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon className="w-12 h-12 mb-4" />
                      </motion.div>
                      <h3 className="font-bold text-xl mb-2 group-hover:scale-105 transition-transform duration-300">
                        {service.title}
                      </h3>
                      <p className="text-white/90 text-sm">
                        {service.description}
                      </p>
                      <div className="absolute top-4 right-4 opacity-20">
                        <Icon className="w-16 h-16" />
                      </div>
                    </div>
                    <div className="p-6 bg-white">
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center text-primary-600 font-medium"
                      >
                        Tìm hiểu thêm
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            data-aos="fade-up"
            data-aos-duration="1000"
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-secondary-900 mb-6">
              Khách hàng <span className="text-gradient">nói gì</span>?
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Những phản hồi tích cực từ khách hàng đã tin tưởng và sử dụng sản phẩm của chúng tôi
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                data-aos-duration="800"
              >
                <Card className="h-full" hover>
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-secondary-600 mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-secondary-900">{testimonial.name}</h4>
                      <p className="text-sm text-secondary-500">{testimonial.role}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            data-aos="fade-up"
            data-aos-duration="1000"
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-secondary-900 mb-6">
              Tin tức & <span className="text-gradient">Hướng dẫn</span>
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Cập nhật những tin tức mới nhất về công nghệ và hướng dẫn sử dụng sản phẩm
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                data-aos-duration="800"
              >
                <Card className="group cursor-pointer h-full overflow-hidden" hover>
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-secondary-500 mb-3">
                      <span>{post.date}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="font-bold text-lg text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="text-secondary-600 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center text-primary-600 font-medium"
                    >
                      Đọc thêm
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-secondary-900">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6">
                Đăng ký nhận tin tức mới nhất
              </h2>
              <p className="text-xl text-secondary-300 mb-8 max-w-2xl mx-auto">
                Nhận thông tin về sản phẩm mới, khuyến mãi đặc biệt và những tin tức công nghệ hấp dẫn
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              >
                <input
                  type="email"
                  placeholder="Nhập email của bạn..."
                  className="flex-1 px-6 py-4 rounded-xl border-0 text-secondary-900 placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors duration-200 whitespace-nowrap"
                >
                  Đăng ký
                </motion.button>
              </motion.div>

              <p className="text-sm text-secondary-400 mt-4">
                Chúng tôi cam kết bảo mật thông tin của bạn và không spam
              </p>
            </motion.div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default HomePage;
