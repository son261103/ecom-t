import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { addressService } from '../../services';
import type { Province, District, Ward, AddressSelection } from '../../types';

// Create a new type that includes the district name for display purposes
interface WardWithDistrict extends Ward {
  district_name: string;
}

interface AddressSelectorProps {
  value: AddressSelection;
  onChange: (selection: AddressSelection) => void;
  error?: {
    province?: string;
    ward?: string; // District error is no longer needed
  };
  disabled?: boolean;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<WardWithDistrict[]>([]);
  const [loading, setLoading] = useState({
    provinces: false,
    wards: false,
  });
  const [selectedProvinceDetails, setSelectedProvinceDetails] = useState<Province | null>(null);

  // Load provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      setLoading(prev => ({ ...prev, provinces: true }));
      try {
        const data = await addressService.getProvinces();
        setProvinces(data);
      } catch (err) {
        console.error('Error loading provinces:', err);
      } finally {
        setLoading(prev => ({ ...prev, provinces: false }));
      }
    };
    loadProvinces();
  }, []);

  // Load wards when province changes
  useEffect(() => {
    if (value.province) {
      const loadWards = async () => {
        setLoading(prev => ({ ...prev, wards: true }));
        setWards([]); // Clear previous wards
        try {
          const provinceDetails = await addressService.getProvinceDetails(value.province.code);
          setSelectedProvinceDetails(provinceDetails);
          if (provinceDetails && provinceDetails.districts) {
            const allWards = provinceDetails.districts.flatMap(district =>
              district.wards.map(ward => ({ ...ward, district_name: district.name }))
            );
            setWards(allWards);
          }
        } catch (err) {
          console.error('Error loading wards:', err);
        } finally {
          setLoading(prev => ({ ...prev, wards: false }));
        }
      };
      loadWards();
    } else {
      setWards([]);
      setSelectedProvinceDetails(null);
    }
  }, [value.province]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceCode = e.target.value;
    const province = provinces.find(p => p.code.toString() === provinceCode);
    onChange({ province, district: undefined, ward: undefined });
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wardCode = e.target.value;
    const selectedWardInfo = wards.find(w => w.code.toString() === wardCode);

    if (selectedWardInfo && selectedProvinceDetails) {
      const district = selectedProvinceDetails.districts.find(
        d => d.code === selectedWardInfo.district_code
      );
      const ward = district?.wards.find(w => w.code === selectedWardInfo.code);
      onChange({ ...value, district, ward });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Province Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tỉnh/Thành phố *</label>
        <div className="relative">
          <select
            value={value.province?.code || ''}
            onChange={handleProvinceChange}
            disabled={disabled || loading.provinces}
            className={`w-full px-4 py-3 border rounded-lg appearance-none bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              error?.province ? 'border-red-500' : 'border-gray-300'
            } ${disabled || loading.provinces ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <option value="">{loading.provinces ? 'Đang tải...' : 'Chọn tỉnh/thành phố'}</option>
            {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
        {error?.province && <p className="mt-1 text-sm text-red-600">{error.province}</p>}
      </div>

      {/* Ward Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Phường/Xã *</label>
        <div className="relative">
          <select
            value={value.ward?.code || ''}
            onChange={handleWardChange}
            disabled={disabled || loading.wards || !value.province}
            className={`w-full px-4 py-3 border rounded-lg appearance-none bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              error?.ward ? 'border-red-500' : 'border-gray-300'
            } ${disabled || loading.wards || !value.province ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <option value="">{loading.wards ? 'Đang tải...' : 'Chọn phường/xã'}</option>
            {wards.map(w => (
              <option key={w.code} value={w.code}>
                {`${w.name} - ${w.district_name}`}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
        {error?.ward && <p className="mt-1 text-sm text-red-600">{error.ward}</p>}
      </div>
    </div>
  );
};

export default AddressSelector;
