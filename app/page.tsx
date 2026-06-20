'use client';

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Users, Workflow, DollarSign, TrendingUp } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [stats, setStats] = useState({
    workflows: 24,
    employees: 156,
    payrolls: 28,
    completion: 92
  });

  const chartData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [{
      label: 'Quy trình hoàn thành',
      data: [18, 22, 20, 25, 28, 24],
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderRadius: 8,
    }]
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Cards with Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { icon: Workflow, label: 'Tổng Quy Trình', value: stats.workflows, color: 'blue' },
          { icon: Users, label: 'Nhân viên', value: stats.employees, color: 'green' },
          { icon: DollarSign, label: 'Bảng lương', value: stats.payrolls, color: 'emerald' },
          { icon: TrendingUp, label: 'Hoàn thành', value: stats.completion + '%', color: 'purple' },
        ].map((stat, index) => (
          <div 
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm hover:scale-105 transition-transform duration-300"
          >
            <stat.icon className={`w-12 h-12 text-${stat.color}-600 mb-4`} />
            <p className="text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8">
        <h2 className="text-xl font-semibold mb-6">Tiến độ hoàn thành quy trình 6 tháng</h2>
        <div className="h-96">
          <Bar 
            data={chartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              animation: {
                duration: 1500,
              },
              plugins: {
                legend: { display: false },
              }
            }} 
          />
        </div>
      </div>
    </div>
  );
}