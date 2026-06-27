'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

interface ChartData {
  name: string;
  count: number;
  fill: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalWorkflows: 0,
    completed: 0,
    pending: 0,
    avgTime: 0,
  });

  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    setStats({
      totalWorkflows: 48,
      completed: 35,
      pending: 8,
      avgTime: 2.4,
    });

    setChartData([
      { name: 'Nghỉ phép', count: 18, fill: COLORS[0] },
      { name: 'Phê duyệt chi phí', count: 12, fill: COLORS[1] },
      { name: 'Xin tăng lương', count: 9, fill: COLORS[2] },
      { name: 'Khác', count: 9, fill: COLORS[3] },
    ]);
  }, []);

  return (
    <div className="p-8 max-w-8xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">AI Analytics Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <p className="text-gray-500">Tổng quy trình</p>
          <p className="text-4xl font-bold mt-2">{stats.totalWorkflows}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <p className="text-gray-500">Hoàn thành</p>
          <p className="text-4xl font-bold text-green-600 mt-2">{stats.completed}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <p className="text-gray-500">Đang chờ</p>
          <p className="text-4xl font-bold text-amber-600 mt-2">{stats.pending}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <p className="text-gray-500">Thời gian trung bình</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">{stats.avgTime} ngày</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm">
          <h3 className="text-xl font-semibold mb-6">Số lượng theo loại quy trình</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={8} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm">
          <h3 className="text-xl font-semibold mb-6">Tỷ lệ hoàn thành</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Hoàn thành', value: stats.completed, fill: '#10b981' },
                  { name: 'Đang chờ', value: stats.pending, fill: '#f59e0b' },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                dataKey="value"
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}