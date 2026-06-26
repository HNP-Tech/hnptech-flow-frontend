'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { Users, DollarSign, Search, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

interface Employee {
  id: string;
  full_name: string;
  position: string;
  department: string;
  salary: number;
}

interface Payroll {
  id: string;
  employee: string;
  period: string;
  basic_salary: number;
  net_salary: number;
  status: string;
}

export default function HRPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Protected Route
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchHRData = async () => {
    try {
      setLoading(true);
      const [empRes, payrollRes] = await Promise.all([
        api.get('/hr/employees/'),
        api.get('/hr/payrolls/'),
      ]);
      setEmployees(empRes.data);
      setPayrolls(payrollRes.data);
    } catch (error) {
      console.error("Lỗi tải HR data:", error);
      toast.error("Không thể tải dữ liệu từ server, đang dùng dữ liệu demo");
      
      // Demo data
      setEmployees([
        { id: "E0001", full_name: "Nguyễn Văn Định", position: "Giám đốc", department: "Ban lãnh đạo", salary: 25000000 },
        { id: "E0002", full_name: "Đặng Thị Quỳnh Vy", position: "Giám đốc Tài chính", department: "Phòng Tài vụ", salary: 22000000 },
      ]);
      setPayrolls([
        { id: "1", employee: "Nguyễn Văn Định", period: "2026-06", basic_salary: 25000000, net_salary: 21850000, status: "Đã thanh toán" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchHRData();
    }
  }, [isAuthenticated]);

  const filteredEmployees = employees.filter(emp =>
    emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Đang kiểm tra quyền truy cập...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-8 max-w-8xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Nhân sự</h1>
          <p className="text-gray-600 mt-1">Quản lý tất cả nhân sự trong hệ thống HNP Tech</p>
        </div>
        
        <button
          onClick={() => toast("Chức năng thêm nhân viên đang phát triển...")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl transition"
        >
          <Plus size={20} />
          Thêm Nhân viên
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Tìm kiếm nhân viên, chức vụ, phòng ban..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <Users className="w-12 h-12 text-blue-600 mb-4" />
          <p className="text-gray-500 text-sm">Tổng nhân viên</p>
          <p className="text-4xl font-bold text-gray-900 mt-1">{employees.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <DollarSign className="w-12 h-12 text-green-600 mb-4" />
          <p className="text-gray-500 text-sm">Bảng lương tháng này</p>
          <p className="text-4xl font-bold text-green-600 mt-1">{payrolls.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-gray-500 text-sm">Tỷ lệ thanh toán</p>
          <p className="text-4xl font-bold text-amber-600 mt-1">100%</p>
        </div>
      </div>

      {/* Danh sách Nhân viên */}
      <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
        <h2 className="text-xl font-semibold mb-6">Danh sách Nhân viên</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-4 px-6 font-medium">Mã NV</th>
                <th className="text-left py-4 px-6 font-medium">Họ tên</th>
                <th className="text-left py-4 px-6 font-medium">Chức vụ</th>
                <th className="text-left py-4 px-6 font-medium">Phòng ban</th>
                <th className="text-right py-4 px-6 font-medium">Lương cơ bản</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 px-6 font-medium text-gray-900">{emp.id}</td>
                  <td className="py-4 px-6">{emp.full_name}</td>
                  <td className="py-4 px-6">{emp.position}</td>
                  <td className="py-4 px-6 text-gray-600">{emp.department}</td>
                  <td className="py-4 px-6 text-right font-medium">
                    {emp.salary.toLocaleString('vi-VN')} ₫
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bảng lương gần nhất */}
      <div className="bg-white rounded-3xl shadow-sm p-8">
        <h2 className="text-xl font-semibold mb-6">Bảng lương gần nhất</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {payrolls.map(p => (
            <div key={p.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{p.employee}</p>
                  <p className="text-sm text-gray-500">Kỳ lương: {p.period}</p>
                </div>
                <span className="px-4 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                  {p.status}
                </span>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-gray-500">Lương cơ bản</p>
                  <p className="font-medium text-lg">{p.basic_salary.toLocaleString('vi-VN')} ₫</p>
                </div>
                <div>
                  <p className="text-gray-500">Thực nhận</p>
                  <p className="font-medium text-lg text-green-600">{p.net_salary.toLocaleString('vi-VN')} ₫</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}