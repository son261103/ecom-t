import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  CreditCard,
  MapPin,
  User,
  ShoppingCart,
  CheckCircle,
  
} from 'lucide-react';
import { Card, Button, Input, Select } from '../components/ui';
import { addressService } from '../services/addressService';
import type { Province, District, Ward } from '../types';
import { useAuth, useCart } from '../contexts';
import { orderService } from '../services';
import type { CreateOrderRequest, PaymentMethod } from '../types';
import { formatCurrency } from '../utils/formatters';
import { ROUTES } from '../utils/constants';
import { toast } from 'react-hot-toast';

const schema = yup.object({
  recipientName: yup
    .string()
    .min(2, 'Tên người nhận phải có ít nhất 2 ký tự')
    .required('Tên người nhận là bắt buộc'),
  recipientPhone: yup
    .string()
    .matches(/^(0|\+84)[3-9]\d{8}$/, 'Số điện thoại không hợp lệ')
    .required('Số điện thoại là bắt buộc'),
  shippingAddress: yup
    .string()
    .min(10, 'Địa chỉ phải có ít nhất 10 ký tự')
    .required('Địa chỉ là bắt buộc'),
  shippingCity: yup
    .string()
    .required('Tỉnh/Thành phố là bắt buộc'),
  shippingWard: yup
    .string()
    .required('Phường/Xã là bắt buộc'),
  paymentMethod: yup
    .string()
    .oneOf(['COD'], 'Phương thức thanh toán không hợp lệ')
    .required('Phương thức thanh toán là bắt buộc'),
  notes: yup.string().optional(),
});

const CheckoutPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateOrderRequest>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      recipientName: user?.name || '',
      paymentMethod: 'COD',
    },
  });

  useEffect(() => {
    const fetchProvinces = async () => {
      const provinceData = await addressService.getProvinces();
      setProvinces(provinceData);
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchWards = async () => {
      if (selectedProvince) {
        const provinceDetails = await addressService.getProvinceDetails(
          Number(selectedProvince)
        );
        if (provinceDetails && provinceDetails.districts) {
          const allWards = provinceDetails.districts.flatMap(
            (district) => district.wards || []
          );
          setWards(allWards);
        } else {
          setWards([]);
        }
      } else {
        setWards([]);
      }
    };

    fetchWards();
  }, [selectedProvince]);

  const paymentMethod = watch('paymentMethod');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
    } else if (cart && cart.items.length === 0) {
      navigate(ROUTES.CART);
    }
  }, [isAuthenticated, cart, navigate]);

  if (!isAuthenticated || !cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Loading size="lg" text="Đang tải..." />
      </div>
    );
  }

  const onSubmit = async (data: CreateOrderRequest) => {
    setIsSubmitting(true);

    const orderData = {
      ...data,
      // Gửi giá trị mặc định cho quận/huyện theo yêu cầu
      shippingDistrict: data.shippingWard, // Sử dụng tạm tên phường/xã làm quận/huyện
      shippingPhone: data.recipientPhone,
    };

    try {
      const order = await orderService.createOrder(orderData);
      await clearCart();
      toast.success('Đặt hàng thành công!');
      navigate(`${ROUTES.ORDERS}/${order.id}`);
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast.error('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentMethods = [
    {
      value: 'COD' as PaymentMethod,
      label: 'Thanh toán khi nhận hàng (COD)',
      description: 'Thanh toán bằng tiền mặt khi nhận hàng',
      icon: <ShoppingCart className="w-5 h-5" />,
    },

  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">
            Thanh toán
          </h1>
          <p className="text-secondary-600">
            Vui lòng điền thông tin để hoàn tất đơn hàng
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Thông tin liên hệ
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      {...register('recipientName')}
                      label="Tên người nhận"
                      placeholder="Nhập tên người nhận"
                      error={errors.recipientName?.message}
                      fullWidth
                    />
                    <Input
                      {...register('recipientPhone')}
                      label="Số điện thoại"
                      placeholder="Nhập số điện thoại"
                      error={errors.recipientPhone?.message}
                      fullWidth
                    />
                  </div>
                </div>
              </Card>

              {/* Shipping Address */}
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Địa chỉ giao hàng
                  </h2>

                  <div className="space-y-4">
                    <Input
                      {...register('shippingAddress')}
                      label="Địa chỉ cụ thể"
                      placeholder="Số nhà, tên đường..."
                      error={errors.shippingAddress?.message}
                      fullWidth
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        {...register('shippingCity')}
                        label="Tỉnh/Thành phố"
                        error={errors.shippingCity?.message}
                        onChange={(e) => setSelectedProvince(e.target.value)}
                        fullWidth
                      >
                        <option value="">Chọn tỉnh/thành phố</option>
                        {provinces.map((p) => (
                          <option key={p.code} value={p.code}>
                            {p.name}
                          </option>
                        ))}
                      </Select>
                      <Select
                        {...register('shippingWard')}
                        label="Phường/Xã"
                        error={errors.shippingWard?.message}
                        disabled={!selectedProvince}
                        fullWidth
                      >
                        <option value="">Chọn phường/xã</option>
                        {wards.map((w) => (
                          <option key={w.code} value={w.code}>
                            {w.name}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Payment Method */}
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Phương thức thanh toán
                  </h2>

                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.value}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                          paymentMethod === method.value
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-secondary-300 hover:border-secondary-400'
                        }`}
                      >
                        <input
                          {...register('paymentMethod')}
                          type="radio"
                          value={method.value}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-3">
                          {method.icon}
                          <div>
                            <div className="font-medium text-secondary-900">
                              {method.label}
                            </div>
                            <div className="text-sm text-secondary-600">
                              {method.description}
                            </div>
                          </div>
                        </div>
                        {paymentMethod === method.value && (
                          <CheckCircle className="w-5 h-5 text-primary-600 ml-auto" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Order Notes */}
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                    Ghi chú đơn hàng (tùy chọn)
                  </h2>
                  <textarea
                    {...register('notes')}
                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                    rows={4}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-8">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                    Đơn hàng của bạn
                  </h2>

                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <img
                          src={item.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                          alt={item.productName}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-secondary-900 line-clamp-2">
                            {item.productName}
                          </p>
                          <p className="text-sm text-secondary-600">
                            Số lượng: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium">
                          {formatCurrency(item.subtotal)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Tạm tính:</span>
                      <span className="font-medium">{formatCurrency(cart.totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Phí vận chuyển:</span>
                      <span className="font-medium text-green-600">Miễn phí</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-primary-600">{formatCurrency(cart.totalPrice)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    loading={isSubmitting}
                    icon={<CheckCircle className="w-5 h-5" />}
                  >
                    Đặt hàng
                  </Button>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-secondary-500">
                      Bằng cách đặt hàng, bạn đồng ý với{' '}
                      <a href="/terms" className="text-primary-600 hover:text-primary-700">
                        Điều khoản sử dụng
                      </a>{' '}
                      của chúng tôi.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
