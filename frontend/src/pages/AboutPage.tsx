import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Target,
  Award,
  Heart,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  Star,
  TrendingUp,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { Card, Button } from '../components/ui';
import { ROUTES } from '../utils/constants';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const stats = [
    {
      icon: Users,
      number: '50,000+',
      label: 'Khách hàng tin tưởng',
      color: 'text-blue-600',
    },
    {
      icon: Award,
      number: '5 năm',
      label: 'Kinh nghiệm thị trường',
      color: 'text-green-600',
    },
    {
      icon: CheckCircle,
      number: '99%',
      label: 'Khách hàng hài lòng',
      color: 'text-purple-600',
    },
    {
      icon: TrendingUp,
      number: '1000+',
      label: 'Sản phẩm chất lượng',
      color: 'text-orange-600',
    },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Chất lượng đảm bảo',
      description: 'Chúng tôi cam kết cung cấp những sản phẩm chính hãng, chất lượng cao từ các thương hiệu uy tín.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Heart,
      title: 'Khách hàng là trung tâm',
      description: 'Sự hài lòng của khách hàng là ưu tiên hàng đầu trong mọi hoạt động kinh doanh của chúng tôi.',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: Zap,
      title: 'Đổi mới không ngừng',
      description: 'Luôn cập nhật những công nghệ mới nhất và xu hướng thị trường để phục vụ khách hàng tốt nhất.',
      color: 'from-yellow-500 to-orange-600',
    },
    {
      icon: Globe,
      title: 'Phục vụ toàn quốc',
      description: 'Mạng lưới phân phối rộng khắp, đảm bảo giao hàng nhanh chóng đến mọi miền đất nước.',
      color: 'from-green-500 to-green-600',
    },
  ];

  const team = [
    {
      name: 'Nguyễn Văn A',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      description: '10 năm kinh nghiệm trong ngành công nghệ',
    },
    {
      name: 'Trần Thị B',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      description: 'Chuyên gia về công nghệ và phát triển sản phẩm',
    },
    {
      name: 'Lê Minh C',
      role: 'Head of Sales',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      description: 'Dẫn dắt đội ngũ bán hàng chuyên nghiệp',
    },
  ];

  const milestones = [
    {
      year: '2019',
      title: 'Thành lập công ty',
      description: 'Electro được thành lập với tầm nhìn trở thành cửa hàng điện tử hàng đầu Việt Nam.',
    },
    {
      year: '2020',
      title: 'Mở rộng sản phẩm',
      description: 'Bổ sung thêm nhiều dòng sản phẩm từ các thương hiệu uy tín trên thế giới.',
    },
    {
      year: '2021',
      title: 'Ra mắt website',
      description: 'Chính thức có mặt trên nền tảng trực tuyến, phục vụ khách hàng 24/7.',
    },
    {
      year: '2022',
      title: 'Đạt 10,000 khách hàng',
      description: 'Cột mốc quan trọng với hơn 10,000 khách hàng tin tưởng và sử dụng dịch vụ.',
    },
    {
      year: '2023',
      title: 'Mở rộng toàn quốc',
      description: 'Phủ sóng dịch vụ ra toàn quốc với hệ thống giao hàng nhanh chóng.',
    },
    {
      year: '2024',
      title: 'Đổi mới công nghệ',
      description: 'Ứng dụng AI và công nghệ mới để nâng cao trải nghiệm khách hàng.',
    },
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-20 lg:py-32 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <h1 className="text-5xl lg:text-7xl font-display font-bold mb-6">
                Về chúng tôi
              </h1>
              <p className="text-xl lg:text-2xl text-primary-100 mb-8 leading-relaxed">
                Electro - Đối tác tin cậy trong hành trình khám phá công nghệ của bạn
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={ROUTES.PRODUCTS}>
                  <Button size="lg" variant="outline" className="bg-white text-primary-600 border-white hover:bg-primary-50">
                    Khám phá sản phẩm
                  </Button>
                </Link>
                <Button size="lg" variant="ghost" className="text-white border-white/30 hover:bg-white/10">
                  Liên hệ với chúng tôi
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  data-aos-duration="800"
                  className="text-center"
                >
                  <div className={`w-16 h-16 ${stat.color} bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="text-4xl font-bold text-secondary-900 mb-2">{stat.number}</div>
                  <div className="text-secondary-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              <div className="mb-8">
                <Target className="w-12 h-12 text-primary-600 mb-4" />
                <h2 className="text-3xl font-bold text-secondary-900 mb-4">Sứ mệnh</h2>
                <p className="text-lg text-secondary-600 leading-relaxed">
                  Mang đến cho khách hàng những sản phẩm công nghệ chất lượng cao với giá cả hợp lý, 
                  cùng dịch vụ chăm sóc khách hàng tận tâm. Chúng tôi cam kết làm cầu nối giữa 
                  công nghệ tiên tiến và nhu cầu thực tế của người Việt Nam.
                </p>
              </div>
              
              <div>
                <Star className="w-12 h-12 text-primary-600 mb-4" />
                <h2 className="text-3xl font-bold text-secondary-900 mb-4">Tầm nhìn</h2>
                <p className="text-lg text-secondary-600 leading-relaxed">
                  Trở thành cửa hàng điện tử trực tuyến hàng đầu Việt Nam, được khách hàng 
                  tin tưởng và lựa chọn số 1 khi có nhu cầu mua sắm các sản phẩm công nghệ. 
                  Góp phần thúc đẩy sự phát triển của ngành công nghệ trong nước.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              data-aos="fade-left"
              data-aos-duration="1000"
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Team working"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl opacity-20 -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
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
              Giá trị <span className="text-gradient">cốt lõi</span>
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Những giá trị định hướng mọi hoạt động và quyết định của chúng tôi
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  data-aos-duration="800"
                >
                  <Card className="text-center h-full group" hover>
                    <div className={`bg-gradient-to-br ${value.color} p-4 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-secondary-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-secondary-600 leading-relaxed">
                      {value.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
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
              Đội ngũ <span className="text-gradient">lãnh đạo</span>
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Những con người tài năng và tâm huyết đang dẫn dắt Electro phát triển
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                data-aos-duration="800"
              >
                <Card className="text-center group" hover>
                  <div className="relative mb-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="font-bold text-xl text-secondary-900 mb-2">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                  <p className="text-secondary-600 text-sm">{member.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-secondary-900 text-white">
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
              <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
                Liên hệ với chúng tôi
              </h2>
              <p className="text-xl text-secondary-300 mb-12">
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="flex flex-col items-center">
                  <Phone className="w-8 h-8 text-primary-400 mb-4" />
                  <h3 className="font-semibold mb-2">Điện thoại</h3>
                  <p className="text-secondary-300">1900 1234</p>
                </div>
                <div className="flex flex-col items-center">
                  <Mail className="w-8 h-8 text-primary-400 mb-4" />
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-secondary-300">contact@electro.com</p>
                </div>
                <div className="flex flex-col items-center">
                  <MapPin className="w-8 h-8 text-primary-400 mb-4" />
                  <h3 className="font-semibold mb-2">Địa chỉ</h3>
                  <p className="text-secondary-300">123 Nguyễn Văn Linh, Q.7, TP.HCM</p>
                </div>
              </div>
              
              <Link to={ROUTES.PRODUCTS}>
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                  Bắt đầu mua sắm
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
