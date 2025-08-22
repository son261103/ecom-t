import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Mail, Lock, Eye, EyeOff, Facebook } from "lucide-react";
import { Button, Input, Card } from "../../components/ui";
import { useAuth } from "../../contexts";
import { authService } from "../../services";
import type { LoginRequest } from "../../types";
import { ROUTES } from "../../utils/constants";
import { toast } from "react-hot-toast";

const schema = yup.object({
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  password: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Mật khẩu là bắt buộc"),
});

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || ROUTES.HOME;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data);

      // Get user data after login to check role
      const userData = authService.getUserData();

      // If user is admin, redirect to admin dashboard
      if (userData && userData.role === "ADMIN") {
        navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
      } else {
        // For regular users, use the original redirect logic
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      console.error("Login failed:", error);
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
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center space-x-2 mb-6"
          >
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-2xl font-display font-bold text-gradient">
              ElectroShop
            </span>
          </Link>
          <h2 className="text-3xl font-display font-bold text-secondary-900">
            Đăng nhập
          </h2>
          <p className="mt-2 text-secondary-600">Chào mừng bạn quay trở lại</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              {...register("email")}
              type="email"
              label="Email"
              placeholder="Nhập email của bạn"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              fullWidth
            />

            <div className="relative">
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
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

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-secondary-600">
                  Ghi nhớ đăng nhập
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Button type="submit" loading={isLoading} fullWidth size="lg">
              Đăng nhập
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-secondary-500">Hoặc</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => toast("Tính năng đang phát triển")}
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
                onClick={() => toast("Tính năng đang phát triển")}
              >
                <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                Facebook
              </Button>
            </div>
          </form>
        </Card>

        <div className="text-center mt-6">
          <p className="text-secondary-600">
            Chưa có tài khoản?{" "}
            <Link
              to={ROUTES.REGISTER}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
