import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Eye,
  Lock,
  Unlock,
  Users,
  UserCheck,
  UserX,
  Shield,
  Calendar,
  Mail,
  
} from 'lucide-react';
import { Card, Button, Input, Loading } from '../../components/ui';
import { useAsync } from '../../hooks';
import type { UserResponse, UserRole } from '../../types';
import { formatDate } from '../../utils/formatters';
import { toast } from 'react-hot-toast';

// Mock user service since we don't have admin user endpoints yet
const mockUserService = {
  getAllUsers: async (): Promise<UserResponse[]> => {
    // This would be replaced with actual API call
    return [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'USER' as UserRole,
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'ADMIN' as UserRole,
        isActive: true,
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-10T10:00:00Z',
      },
    ];
  },
  
  updateUserStatus: async (userId: number, isActive: boolean): Promise<void> => {
    // Mock API call
    console.log(`Updating user ${userId} status to ${isActive}`);
  },
  
  updateUserRole: async (userId: number, role: UserRole): Promise<void> => {
    // Mock API call
    console.log(`Updating user ${userId} role to ${role}`);
  },
};

const UserManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Fetch users (using mock service for now)
  const {
    data: users,
    loading,
    execute: refetchUsers,
  } = useAsync<UserResponse[]>(
    () => mockUserService.getAllUsers(),
    [],
    { immediate: true }
  );

  const handleUpdateUserStatus = async (userId: number, isActive: boolean, userName: string) => {
    const action = isActive ? 'kích hoạt' : 'vô hiệu hóa';
    if (window.confirm(`Bạn có chắc chắn muốn ${action} tài khoản "${userName}"?`)) {
      try {
        await mockUserService.updateUserStatus(userId, isActive);
        toast.success(`${action.charAt(0).toUpperCase() + action.slice(1)} tài khoản thành công!`);
        refetchUsers();
      } catch (error) {
        console.error('Error updating user status:', error);
        toast.error(`Có lỗi xảy ra khi ${action} tài khoản`);
      }
    }
  };

  const handleUpdateUserRole = async (userId: number, role: UserRole, userName: string) => {
    const roleText = role === 'ADMIN' ? 'quản trị viên' : 'người dùng';
    if (window.confirm(`Bạn có chắc chắn muốn đặt "${userName}" làm ${roleText}?`)) {
      try {
        await mockUserService.updateUserRole(userId, role);
        toast.success(`Cập nhật quyền thành công!`);
        refetchUsers();
      } catch (error) {
        console.error('Error updating user role:', error);
        toast.error('Có lỗi xảy ra khi cập nhật quyền');
      }
    }
  };

  // Filter users
  const filteredUsers = users?.filter(user => {
    const matchesSearch = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || 
      (statusFilter === 'ACTIVE' && user.isActive) ||
      (statusFilter === 'INACTIVE' && !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  }) || [];

  const roleOptions = [
    { value: 'ALL' as const, label: 'Tất cả', count: users?.length || 0 },
    { value: 'USER' as UserRole, label: 'Người dùng', count: users?.filter(u => u.role === 'USER').length || 0 },
    { value: 'ADMIN' as UserRole, label: 'Quản trị viên', count: users?.filter(u => u.role === 'ADMIN').length || 0 },
  ];

  const statusOptions = [
    { value: 'ALL' as const, label: 'Tất cả', count: users?.length || 0 },
    { value: 'ACTIVE' as const, label: 'Hoạt động', count: users?.filter(u => u.isActive).length || 0 },
    { value: 'INACTIVE' as const, label: 'Vô hiệu hóa', count: users?.filter(u => !u.isActive).length || 0 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Loading size="lg" text="Đang tải người dùng..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">
            Quản lý người dùng
          </h1>
          <p className="text-secondary-600">
            Quản lý tất cả người dùng và phân quyền trong hệ thống
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Tổng người dùng</p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {users?.length || 0}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Hoạt động</p>
                  <p className="text-2xl font-bold text-green-600">
                    {users?.filter(u => u.isActive).length || 0}
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Vô hiệu hóa</p>
                  <p className="text-2xl font-bold text-red-600">
                    {users?.filter(u => !u.isActive).length || 0}
                  </p>
                </div>
                <UserX className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Quản trị viên</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {users?.filter(u => u.role === 'ADMIN').length || 0}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Role Filter */}
              <div className="flex flex-wrap gap-2">
                {roleOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setRoleFilter(option.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      roleFilter === option.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                    }`}
                  >
                    {option.label} ({option.count})
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setStatusFilter(option.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      statusFilter === option.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                    }`}
                  >
                    {option.label} ({option.count})
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="w-full lg:w-auto lg:min-w-[300px]">
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                  fullWidth
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Users Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Ngày tham gia
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-secondary-500">
                      Không tìm thấy người dùng nào
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-secondary-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center mr-4">
                            <span className="text-white font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-secondary-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-secondary-500 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateUserRole(user.id, e.target.value as UserRole, user.name)}
                          className={`text-xs px-3 py-1 rounded-full border-0 font-medium ${
                            user.role === 'ADMIN' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          <option value="USER">Người dùng</option>
                          <option value="ADMIN">Quản trị viên</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateUserStatus(user.id, !user.isActive, user.name)}
                          >
                            {user.isActive ? (
                              <Lock className="w-4 h-4 text-red-600" />
                            ) : (
                              <Unlock className="w-4 h-4 text-green-600" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;
