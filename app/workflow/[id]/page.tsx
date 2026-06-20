'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { ArrowLeft, CheckCircle, User, Calendar, AlertCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import toast from 'react-hot-toast';

interface WorkflowInstance {
  id: string;
  template: string;
  status: string;
  current_step: number;
  created_by: string;
  created_at: string;
  completed_at?: string;
  ai_suggestion?: any;
}

interface ApprovalTask {
  id: string;
  step_number: number;
  assigned_to: string;
  status: string;
  comment: string;
  approved_at?: string;
}

export default function WorkflowInstanceDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [instance, setInstance] = useState<WorkflowInstance | null>(null);
  const [tasks, setTasks] = useState<ApprovalTask[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInstance = async () => {
    try {
      const res = await api.get(`/instances/${id}/`);
      setInstance(res.data);
    } catch (error) {
      console.error("Lỗi tải Instance:", error);
    }
  };

const fetchTasks = async () => {
  try {
    const res = await api.get(`/approval-tasks/?workflow_instance=${id}`);
    setTasks(res.data);
  } catch (error) {
    console.error("Lỗi tải tasks:", error);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchInstance();
    fetchTasks();
  }, [id]);

  const handleApprove = async (taskId: string) => {
    try {
      await api.patch(`/approval-tasks/${taskId}/`, { status: 'approved' });
      fetchTasks();
      fetchInstance();
      toast.success("✅ Phê duyệt thành công!");
    } catch (error) {
      toast.error("❌ Lỗi phê duyệt");
    }
  };

  const handleReject = async (taskId: string) => {
    try {
      const comment = prompt("Nhập lý do từ chối:");
      await api.patch(`/approval-tasks/${taskId}/`, { 
        status: 'rejected', 
        comment: comment || '' 
      });
      fetchTasks();
      fetchInstance();
      toast.success("✅ Đã từ chối!");
    } catch (error) {
      toast.error("❌ Lỗi từ chối");
    }
  };

  const handleContinue = async () => {
    toast("Tiếp tục phê duyệt - Chức năng đang phát triển", { icon: '🚀' });
  };

  const handleCancel = async () => {
    if (confirm("Bạn chắc chắn muốn hủy quy trình?")) {
      try {
        await api.patch(`/instances/${id}/`, { status: 'cancelled' });
        toast.success("✅ Đã hủy quy trình!");
        router.push('/workflow');
      } catch (error) {
        toast.error("❌ Lỗi hủy quy trình");
      }
    }
  };

  const handleBranch = async (taskId: string, nextStep: number) => {
    try {
      await api.patch(`/approval-tasks/${taskId}/`, { status: 'approved' });
      fetchTasks();
      fetchInstance();
      toast.success(`✅ Rẽ nhánh thành công sang bước ${nextStep}`);
    } catch (error) {
      toast.error("❌ Lỗi rẽ nhánh");
    }
  };

  if (loading) {
    return <div className="text-center py-12">Đang tải chi tiết...</div>;
  }

  if (!instance) {
    return <div className="text-center py-12 text-red-500">Không tìm thấy Instance</div>;
  }

  const progress = Math.round((instance.current_step / 5) * 100);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
      >
        <ArrowLeft size={20} />
        Quay lại danh sách
      </button>

      <div className="bg-white rounded-3xl shadow-sm p-10">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">{instance.template}</h1>
            <p className="text-gray-500 mt-1">Mã: {instance.id}</p>
          </div>
          <div className={`px-5 py-2 rounded-full text-sm font-medium ${
            instance.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {instance.status}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-10">
          <div className="flex justify-between text-sm mb-2">
            <span>Tiến độ</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-3 bg-blue-600 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* AI Suggestion */}
        {instance.ai_suggestion && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
            <div className="flex items-center gap-2 text-yellow-700">
              <AlertCircle size={20} />
              <span className="font-medium">AI Gợi ý</span>
            </div>
            <p className="text-sm text-yellow-600 mt-2">{instance.ai_suggestion.reason}</p>
          </div>
        )}

       {/* Timeline with Real Tasks */}
<div>
  <h3 className="font-semibold mb-6 text-lg">Tiến trình phê duyệt</h3>
  <div className="space-y-8">
    {tasks.length > 0 ? (
      Array.from(new Map(tasks.map(item => [item.step_number, item])).values())
        .sort((a, b) => a.step_number - b.step_number)
        .map((task) => (
          <div key={task.id} className="flex gap-6 border-l-4 border-gray-200 pl-6">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
              task.status === 'approved' ? 'bg-green-500 border-green-500 text-white' :
              task.status === 'rejected' ? 'bg-red-500 border-red-500 text-white' : 'border-gray-300'
            }`}>
              {task.status === 'approved' ? <CheckCircle size={22} /> :
               task.status === 'rejected' ? <ThumbsDown size={22} /> : task.step_number}
            </div>
            <div className="pt-1 flex-1">
              <p className="font-medium">Bước {task.step_number}: Phê duyệt</p>
              <p className="text-sm text-gray-500">Người phê duyệt: {task.assigned_to}</p>
              {task.comment && <p className="text-sm text-gray-600 mt-1">{task.comment}</p>}
              <p className="text-xs text-gray-400 mt-1">
                {task.status === 'approved' ? 'Hoàn thành' :
                 task.status === 'rejected' ? 'Từ chối' : 'Chờ phê duyệt'}
              </p>
            </div>
            {task.status === 'pending' && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(task.id)}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700"
                >
                  <ThumbsUp size={16} className="inline" /> Duyệt
                </button>
                <button
                  onClick={() => handleReject(task.id)}
                  className="px-4 py-2 bg-red-600 text-white text-sm rounded-xl hover:bg-red-700"
                >
                  <ThumbsDown size={16} className="inline" /> Từ chối
                </button>
                <button
                  onClick={() => handleBranch(task.id, task.step_number + 1)}
                  className="px-4 py-2 bg-purple-600 text-white text-sm rounded-xl hover:bg-purple-700"
                >
                  Rẽ nhánh
                </button>
              </div>
            )}
          </div>
        ))
    ) : (
      <div className="text-gray-500">Chưa có nhiệm vụ phê duyệt.</div>
    )}
  </div>
</div>

        {/* Action Buttons */}
        <div className="mt-12 flex gap-4">
          <button
            onClick={handleContinue}
            className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-medium hover:bg-blue-700"
          >
            Tiếp tục phê duyệt
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 border border-gray-300 py-4 rounded-2xl hover:bg-gray-50"
          >
            Hủy quy trình
          </button>
        </div>
      </div>
    </div>
  );
}