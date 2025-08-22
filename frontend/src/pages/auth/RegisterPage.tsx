import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Mail, Lock, Eye, EyeOff, Facebook } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui';
import { useAuth } from '../../contexts';
import type { RegisterRequest } from '../../types';
import { ROUTES } from '../../utils/constants';
import { toast } from 'react-hot-toast';

const schema = yup.object({
  name: yup
    .string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(255, 'Tên không được quá 255 ký tự')
    .required('Tên là bắt buộc'),
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  password: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Mật khẩu là bắt buộc'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
});

type RegisterFormData = RegisterRequest & {
  confirmPassword: string;
};

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData);

      // Add small delay to ensure auth state is properly updated
      setTimeout(() => {
        navigate(ROUTES.HOME);
      }, 500);
    } catch (error: any) {
      console.error('Registration failed:', error);
      // Error is already handled by the auth service
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <Link to={ROUTES.HOME} className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-2xl font-display font-bold text-gradient">
              ElectroShop
            </span>
          </Link>
          <h2 className="text-3xl font-display font-bold text-secondary-900">
            Đăng ký
          </h2>
          <p className="mt-2 text-secondary-600">
            Tạo tài khoản mới để bắt đầu mua sắm
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              {...register('name')}
              type="text"
              label="Họ và tên"
              placeholder="Nhập họ và tên của bạn"
              icon={<User className="w-4 h-4" />}
              error={errors.name?.message}
              fullWidth
            />

            <Input
              {...register('email')}
              type="email"
              label="Email"
              placeholder="Nhập email của bạn"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              fullWidth
            />

            <div className="relative">
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                icon={<Lock className="w-4 h-4" />}
                error={errors.password?.message}
                fullWidth
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-secondary-400 hover:text-secondary-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="relative">
              <Input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                label="Xác nhận mật khẩu"
                placeholder="Nhập lại mật khẩu"
                icon={<Lock className="w-4 h-4" />}
                error={errors.confirmPassword?.message}
                fullWidth
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-8 text-secondary-400 hover:text-secondary-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                required
                className="mt-1 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
              <label className="ml-2 text-sm text-secondary-600">
                Tôi đồng ý với{' '}
                <Link
                  to="/terms"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Điều khoản sử dụng
                </Link>{' '}
                và{' '}
                <Link
                  to="/privacy"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Chính sách bảo mật
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              loading={isLoading}
              fullWidth
              size="lg"
            >
              Đăng ký
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-secondary-500">
                  Hoặc
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => toast('Tính năng đang phát triển')}
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  className="w-4 h-4 mr-2"
                />
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => toast('Tính năng đang phát triển')}
              >
                <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                Facebook
              </Button>
            </div>
          </form>
        </Card>

        <div className="text-center mt-6">
          <p className="text-secondary-600">
            Đã có tài khoản?{' '}
            <Link
              to={ROUTES.LOGIN}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
