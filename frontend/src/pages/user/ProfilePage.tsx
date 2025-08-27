import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  User,
  Calendar,
  Edit3,
  Save,
  X,
  Shield,
  Bell,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Mail,
} from 'lucide-react';
import { Card, Button, Input, Loading } from '../../components/ui';
import { useAuth } from '../../contexts';
import type { UpdateProfileRequest, ChangePasswordRequest } from '../../types';
import { formatDate } from '../../utils/formatters';

const schema = yup.object({
  name: yup
    .string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(255, 'Tên không được quá 255 ký tự')
    .required('Tên là bắt buộc'),
});

const passwordSchema = yup.object({
  currentPassword: yup
    .string()
    .required('Mật khẩu hiện tại là bắt buộc'),
  newPassword: yup
    .string()
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .required('Mật khẩu mới là bắt buộc'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Xác nhận mật khẩu không khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
});

const ProfilePage: React.FC = () => {
  const { user, updateProfile, changePassword, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<ChangePasswordRequest & { confirmPassword: string }>({
    resolver: yupResolver(passwordSchema),
  });

  const onSubmit = async (data: UpdateProfileRequest) => {
    setIsUpdating(true);
    try {
      await updateProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    reset({ name: user?.name || '' });
    setIsEditing(false);
  };

  const onPasswordSubmit = async (data: ChangePasswordRequest & { confirmPassword: string }) => {
    setIsUpdatingPassword(true);
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setIsChangingPassword(false);
      resetPassword();
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleCancelPasswordChange = () => {
    resetPassword();
    setIsChangingPassword(false);
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Loading size="lg" text="Đang tải thông tin..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">
            Thông tin tài khoản
          </h1>
          <p className="text-secondary-600">
            Quản lý thông tin cá nhân và cài đặt tài khoản của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-secondary-900">
                    Thông tin cá nhân
                  </h2>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      icon={<Edit3 className="w-4 h-4" />}
                    >
                      Chỉnh sửa
                    </Button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                      {...register('name')}
                      label="Họ và tên"
                      placeholder="Nhập họ và tên"
                      icon={<User className="w-4 h-4" />}
                      error={errors.name?.message}
                      fullWidth
                    />

                    <div className="flex space-x-4">
                      <Button
                        type="submit"
                        loading={isUpdating}
                        icon={<Save className="w-4 h-4" />}
                      >
                        Lưu thay đổi
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEdit}
                        icon={<X className="w-4 h-4" />}
                      >
                        Hủy
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-xl font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-secondary-900">
                          {user.name}
                        </h3>
                        <p className="text-secondary-600">{user.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-secondary-400" />
                        <div>
                          <p className="text-sm text-secondary-600">Email</p>
                          <p className="font-medium text-secondary-900">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-secondary-400" />
                        <div>
                          <p className="text-sm text-secondary-600">Vai trò</p>
                          <p className="font-medium text-secondary-900">
                            {user.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-secondary-400" />
                        <div>
                          <p className="text-sm text-secondary-600">Ngày tham gia</p>
                          <p className="font-medium text-secondary-900">
                            {formatDate(user.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-secondary-400" />
                        <div>
                          <p className="text-sm text-secondary-600">Cập nhật lần cuối</p>
                          <p className="font-medium text-secondary-900">
                            {formatDate(user.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Security Settings */}
            <Card className="mt-6">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                  Bảo mật
                </h2>
                
                <div className="space-y-4">
                  <div className="p-4 border border-secondary-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-secondary-400" />
                        <div>
                          <p className="font-medium text-secondary-900">Mật khẩu</p>
                          <p className="text-sm text-secondary-600">
                            Cập nhật lần cuối: {formatDate(user.updatedAt)}
                          </p>
                        </div>
                      </div>
                      {!isChangingPassword && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsChangingPassword(true)}
                        >
                          Đổi mật khẩu
                        </Button>
                      )}
                    </div>

                    {isChangingPassword && (
                      <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                        <div className="relative">
                          <Input
                            {...registerPassword('currentPassword')}
                            type={showCurrentPassword ? 'text' : 'password'}
                            label="Mật khẩu hiện tại"
                            placeholder="Nhập mật khẩu hiện tại"
                            icon={<Lock className="w-4 h-4" />}
                            error={passwordErrors.currentPassword?.message}
                            fullWidth
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-8 text-secondary-400 hover:text-secondary-600"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        <div className="relative">
                          <Input
                            {...registerPassword('newPassword')}
                            type={showNewPassword ? 'text' : 'password'}
                            label="Mật khẩu mới"
                            placeholder="Nhập mật khẩu mới"
                            icon={<Lock className="w-4 h-4" />}
                            error={passwordErrors.newPassword?.message}
                            fullWidth
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-8 text-secondary-400 hover:text-secondary-600"
                          >
                            {showNewPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        <div className="relative">
                          <Input
                            {...registerPassword('confirmPassword')}
                            type={showConfirmPassword ? 'text' : 'password'}
                            label="Xác nhận mật khẩu mới"
                            placeholder="Nhập lại mật khẩu mới"
                            icon={<Lock className="w-4 h-4" />}
                            error={passwordErrors.confirmPassword?.message}
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

                        <div className="flex space-x-3">
                          <Button
                            type="submit"
                            loading={isUpdatingPassword}
                            disabled={isUpdatingPassword}
                            icon={<Save className="w-4 h-4" />}
                          >
                            Lưu mật khẩu
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancelPasswordChange}
                            disabled={isUpdatingPassword}
                            icon={<X className="w-4 h-4" />}
                          >
                            Hủy
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>


                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Stats */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                  Thống kê tài khoản
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Đơn hàng:</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Tổng chi tiêu:</span>
                    <span className="font-medium">0đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Điểm tích lũy:</span>
                    <span className="font-medium">0</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                  Thao tác nhanh
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    fullWidth
                    icon={<MapPin className="w-4 h-4" />}
                  >
                    Sổ địa chỉ
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    icon={<Bell className="w-4 h-4" />}
                  >
                    Cài đặt thông báo
                  </Button>
                </div>
              </div>
            </Card>

            {/* Account Status */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                  Trạng thái tài khoản
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-secondary-600">Tài khoản hoạt động</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
