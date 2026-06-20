'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { Users, DollarSign, Search } from 'lucide-react';

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
  const { isAuthenticated } = useAuth();

  // Protected Route
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
      // Demo data khi lỗi
      setEmployees([
        { id: "E0001", full_name: "Văn Định Nguyễn", position: "Giám đốc", department: "Ban lãnh đạo", salary: 25000000 },
      ]);
      setPayrolls([
        { id: "1", employee: "Văn Định Nguyễn", period: "2026-06", basic_salary: 25000000, net_salary: 21850000, status: "Đã thanh toán" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHRData();
  }, []);

  const filteredEmployees = employees.filter(emp =>
    emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quản lý Nhân sự</h1>
        <div className="relative w-80">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm nhân viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <Users className="w-12 h-12 text-blue-600 mb-4" />
          <p className="text-gray-500">Tổng nhân viên</p>
          <p className="text-4xl font-bold">{employees.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <DollarSign className="w-12 h-12 text-green-600 mb-4" />
          <p className="text-gray-500">Bảng lương tháng này</p>
          <p className="text-4xl font-bold text-green-600">{payrolls.length}</p>
        </div>
      </div>

      {/* Danh sách Nhân viên */}
      <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
        <h2 className="text-xl font-semibold mb-6">Danh sách Nhân viên</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-4 px-6">Mã NV</th>
                <th className="text-left py-4 px-6">Họ tên</th>
                <th className="text-left py-4 px-6">Chức vụ</th>
                <th className="text-left py-4 px-6">Phòng ban</th>
                <th className="text-right py-4 px-6">Lương cơ bản</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium">{emp.id}</td>
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

      {/* Bảng lương */}
      <div className="bg-white rounded-3xl shadow-sm p-8">
        <h2 className="text-xl font-semibold mb-6">Bảng lương gần nhất</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {payrolls.map(p => (
            <div key={p.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition">
              <p className="font-semibold">{p.employee}</p>
              <p className="text-sm text-gray-500">Kỳ: {p.period}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Lương cơ bản</p>
                  <p>{p.basic_salary.toLocaleString('vi-VN')} ₫</p>
                </div>
                <div>
                  <p className="text-gray-500">Thực nhận</p>
                  <p className="font-medium text-green-600">{p.net_salary.toLocaleString('vi-VN')} ₫</p>
                </div>
              </div>
              <div className="mt-4 text-right">
                <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}