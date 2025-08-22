import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Clock,
} from 'lucide-react';
import { ROUTES, COMPANY_INFO, SOCIAL_LINKS } from '../../utils/constants';

const Footer: React.FC = () => {
  const footerSections = [
    {
      title: 'Về chúng tôi',
      links: [
        { name: 'Giới thiệu', href: '/about' },
        { name: 'Tin tức', href: '/news' },
        { name: 'Tuyển dụng', href: '/careers' },
        { name: 'Liên hệ', href: '/contact' },
      ],
    },
    {
      title: 'Hỗ trợ khách hàng',
      links: [
        { name: 'Hướng dẫn mua hàng', href: '/guide' },
        { name: 'Chính sách đổi trả', href: '/return-policy' },
        { name: 'Chính sách bảo hành', href: '/warranty' },
        { name: 'Câu hỏi thường gặp', href: '/faq' },
      ],
    },
    {
      title: 'Danh mục sản phẩm',
      links: [
        { name: 'Điện thoại', href: `${ROUTES.CATEGORIES}/dien-thoai` },
        { name: 'Laptop', href: `${ROUTES.CATEGORIES}/laptop` },
        { name: 'Tablet', href: `${ROUTES.CATEGORIES}/tablet` },
        { name: 'Phụ kiện', href: `${ROUTES.CATEGORIES}/phu-kien` },
      ],
    },
    {
      title: 'Chính sách',
      links: [
        { name: 'Điều khoản sử dụng', href: '/terms' },
        { name: 'Chính sách bảo mật', href: '/privacy' },
        { name: 'Chính sách thanh toán', href: '/payment-policy' },
        { name: 'Chính sách vận chuyển', href: '/shipping-policy' },
      ],
    },
  ];

  const socialIcons = [
    { icon: Facebook, href: SOCIAL_LINKS.FACEBOOK, name: 'Facebook' },
    { icon: Instagram, href: SOCIAL_LINKS.INSTAGRAM, name: 'Instagram' },
    { icon: Twitter, href: SOCIAL_LINKS.TWITTER, name: 'Twitter' },
    { icon: Youtube, href: SOCIAL_LINKS.YOUTUBE, name: 'Youtube' },
  ];

  return (
    <footer className="bg-secondary-900 text-white">
      {/* Main Footer Content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to={ROUTES.HOME} className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-display font-bold">
                Electro
              </span>
            </Link>
            
            <p className="text-secondary-300 mb-6 leading-relaxed">
              {COMPANY_INFO.DESCRIPTION}. Chúng tôi cam kết mang đến những sản phẩm 
              chất lượng cao với giá cả hợp lý và dịch vụ tốt nhất.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <span className="text-secondary-300 text-sm">
                  {COMPANY_INFO.ADDRESS}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <span className="text-secondary-300 text-sm">
                  {COMPANY_INFO.PHONE}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <span className="text-secondary-300 text-sm">
                  {COMPANY_INFO.EMAIL}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <span className="text-secondary-300 text-sm">
                  {COMPANY_INFO.WORKING_HOURS}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h3 className="font-semibold text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-secondary-700">
          <div className="max-w-md">
            <h3 className="font-semibold text-white mb-2">
              Đăng ký nhận tin tức
            </h3>
            <p className="text-secondary-300 text-sm mb-4">
              Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt
            </p>
            <form className="flex space-x-2">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-2 bg-secondary-800 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium"
              >
                Đăng ký
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-secondary-700">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-secondary-400 text-sm">
              © {new Date().getFullYear()} {COMPANY_INFO.NAME}. Tất cả quyền được bảo lưu.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-secondary-400 text-sm mr-2">
                Theo dõi chúng tôi:
              </span>
              {socialIcons.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-8 h-8 bg-secondary-800 rounded-full flex items-center justify-center text-secondary-400 hover:text-primary-400 hover:bg-secondary-700 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
