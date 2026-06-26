'use client';

import { useState, useEffect } from 'react';
import { useNotifications } from '../../../hooks/useNotifications';
import api from '../../../lib/api';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react';

interface ApprovalTask {
  id: string;
  step_name: string;
  workflow_instance: string | { id?: string; template?: { name: string } };
  status: string;
  ai_suggestion?: {
    suggestion: string;
    reason: string;
    confidence: number;
  };
}

export default function MyTasks() {
  const [tasks, setTasks] = useState<ApprovalTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<ApprovalTask | null>(null);
  const [comment, setComment] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const { notifications } = useNotifications();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/approval-tasks/');
      console.log("✅ Tasks from backend:", res.data);
      setTasks(res.data);
    } catch (error) {
      console.error("❌ Lỗi tải tasks:", error);
      toast.error("Không tải được công việc");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const openModal = (task: ApprovalTask, type: 'approve' | 'reject') => {
    setSelectedTask(task);
    setActionType(type);
    setComment('');
  };

  const handleConfirm = async () => {
    if (!selectedTask || !actionType) return;
    toast.success(
      actionType === 'approve'
        ? `✅ Đã phê duyệt ${selectedTask.step_name}`
        : `❌ Đã từ chối ${selectedTask.step_name}`
    );
    setSelectedTask(null);
    setActionType(null);
    setComment('');
    fetchTasks();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Công việc cần xử lý</h1>
          <p className="text-gray-600">Các yêu cầu đang chờ phê duyệt của bạn</p>
        </div>
        <div className="text-sm text-gray-500">{tasks.length} công việc</div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-500">Đang tải...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-20 text-gray-500">Không có công việc nào cần xử lý.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h3 className="font-semibold text-xl text-gray-900">
                    {typeof task.workflow_instance === 'string' 
                      ? task.workflow_instance 
                      : task.workflow_instance?.template?.name || 'Không rõ quy trình'}
                  </h3>
                  <p className="text-gray-600 mt-2 font-medium">{task.step_name}</p>
                </div>
              </div>

              {task.ai_suggestion && (
                <div className="mt-6 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2 text-sm mb-2 text-blue-600 font-medium">
                    Grok gợi ý • {(task.ai_suggestion.confidence * 100).toFixed(0)}%
                  </div>
                  <p className="text-gray-700 italic">💡 {task.ai_suggestion.reason}</p>
                </div>
              )}

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => openModal(task, 'approve')}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-semibold transition"
                >
                  <CheckCircle size={20} />
                  Phê Duyệt
                </button>
                <button
                  onClick={() => openModal(task, 'reject')}
                  className="flex-1 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-2xl font-semibold transition"
                >
                  <XCircle size={20} />
                  Từ Chối
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Comment */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-2">
              {actionType === 'approve' ? 'Phê duyệt' : 'Từ chối'} yêu cầu
            </h2>
            <p className="text-gray-600 mb-6">
              {typeof selectedTask.workflow_instance === 'string' 
                ? selectedTask.workflow_instance 
                : selectedTask.workflow_instance?.template?.name || 'Không rõ quy trình'}
            </p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Nhập ghi chú / lý do..."
              className="w-full h-40 p-5 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 resize-y"
            />
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setSelectedTask(null)}
                className="flex-1 py-4 border border-gray-300 rounded-2xl font-medium hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}