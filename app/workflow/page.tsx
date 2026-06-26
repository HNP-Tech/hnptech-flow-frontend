'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import api from '../../lib/api';
import { Plus, Play, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNotifications } from '../../hooks/useNotifications';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}

export default function WorkflowPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { notifications } = useNotifications();   // Dùng hook

  const [workflows, setWorkflows] = useState<WorkflowTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Protected Route
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchWorkflows();
  }, [isAuthenticated, authLoading, router]);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const res = await api.get('/templates/');
      setWorkflows(res.data);
    } catch (error: any) {
      console.error("❌ Lỗi kết nối API:", error);
      setWorkflows([
        { id: "1", name: "Nghỉ phép nhân viên", description: "Quy trình xin nghỉ phép", is_active: true },
        { id: "2", name: "Phê duyệt chi phí", description: "Duyệt đề nghị chi phí", is_active: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkflows = workflows.filter(wf => {
    const matchesSearch = wf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wf.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && wf.is_active) ||
                         (statusFilter === 'inactive' && !wf.is_active);
    return matchesSearch && matchesStatus;
  });

  const handleRun = async (templateId: string) => {
    try {
      const res = await api.post('/instances/', { template: templateId });
      toast.success("✅ Đã chạy quy trình!");
      router.push(`/workflow/${res.data.id}`);
    } catch (error) {
      toast.error("❌ Lỗi chạy quy trình");
    }
  };

  if (authLoading) {
    return <div className="text-center py-12">Đang kiểm tra quyền truy cập...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-8 max-w-8xl mx-auto">
      {/* Realtime Notifications */}
      {notifications.length > 0 && (
        <div className="mb-6 space-y-2">
          {notifications.map((noti, index) => (
            <div key={index} className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-xl flex gap-3">
              <span>🛎️</span>
              <div>
                <p className="font-medium">{noti.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quy Trình Phê Duyệt</h1>
          <p className="text-gray-600 mt-1">Quản lý tất cả quy trình trong hệ thống</p>
        </div>

        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl transition"
          onClick={async () => {
            const name = prompt("Nhập tên quy trình mới:");
            const description = prompt("Nhập mô tả quy trình (tùy chọn):");
            if (!name) return;
            try {
              await api.post('/templates/', { name, description: description || '', is_active: true });
              toast.success("✅ Tạo quy trình thành công!");
              fetchWorkflows();
            } catch (error) {
              toast.error("❌ Lỗi khi tạo.");
            }
          }}
        >
          <Plus size={20} />
          Tạo Quy Trình Mới
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm quy trình..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
        >
          <option value="all">Tất cả</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Tạm dừng</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">Đang tải dữ liệu...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkflows.length > 0 ? (
            filteredWorkflows.map((wf, index) => (
              <motion.div
                key={wf.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white border border-gray-200 rounded-3xl p-6 hover:shadow-xl transition-all"
              >
                <div className="flex justify-between">
                  <h3 className="font-semibold text-xl">{wf.name}</h3>
                  <span className={`px-3 py-1 text-xs rounded-full ${wf.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                    {wf.is_active ? 'Hoạt động' : 'Tạm dừng'}
                  </span>
                </div>
                <p className="text-gray-600 mt-3 line-clamp-2">{wf.description}</p>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleRun(wf.id)}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700"
                  >
                    <Play size={18} />
                    Chạy
                  </button>
                  <button className="flex-1 border border-gray-300 py-3 rounded-2xl hover:bg-gray-50">
                    Chi tiết
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center py-12 text-gray-500">Không tìm thấy quy trình nào.</p>
          )}
        </div>
      )}
    </div>
  );
}