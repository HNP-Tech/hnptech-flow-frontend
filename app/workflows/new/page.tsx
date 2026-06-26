'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import toast from 'react-hot-toast';

interface Field {
  name: string;
  label: string;
  type: string;
}

interface Template {
  id: string;
  name: string;
  definition: { fields: Field[] };
}

export default function NewWorkflowPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const res = await api.get('/templates/');
        setTemplates(res.data);
      } catch (error) {
        toast.error("Không tải được danh sách quy trình");
      }
    };
    loadTemplates();
  }, []);

  const handleSubmit = async () => {
    if (!selectedTemplate) return;
    setLoading(true);

    try {
      const res = await api.post(`/templates/${selectedTemplate.id}/start/`, {
        data: formData
      });
      toast.success("✅ Quy trình đã được khởi tạo!");
      router.push(`/workflows/tasks`);
    } catch (error) {
      toast.error("❌ Không thể khởi tạo quy trình");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Tạo Quy Trình Mới</h1>

      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <label className="block text-sm font-medium mb-2">Chọn loại quy trình</label>
        <select 
          className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
          onChange={(e) => {
            const tmpl = templates.find(t => t.id === e.target.value);
            setSelectedTemplate(tmpl || null);
            setFormData({});
          }}
        >
          <option value="">Chọn loại quy trình</option>
          {templates.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        {selectedTemplate && (
          <div className="mt-10 space-y-6">
            <h2 className="text-xl font-semibold">{selectedTemplate.name}</h2>
            
            {selectedTemplate.definition.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium mb-2">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 h-32"
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  />
                ) : (
                  <input
                    type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                    className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  />
                )}
              </div>
            ))}

            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold text-lg transition"
            >
              {loading ? 'Đang xử lý...' : '🚀 Khởi Tạo & Gửi Duyệt'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}