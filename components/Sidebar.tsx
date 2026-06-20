'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Workflow, Users, FileText, BarChart3, Settings, Moon, Sun, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const menuItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Quy Trình', href: '/workflow', icon: Workflow },
  { name: 'Nhân Sự', href: '/hr', icon: Users },
  { name: 'Báo Cáo', href: '/reports', icon: BarChart3 },
  { name: 'Tài liệu', href: '/documents', icon: FileText },
  { name: 'Cài đặt', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-[60] p-3 bg-white rounded-2xl shadow-lg dark:bg-gray-800"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`w-72 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col z-50 transition-transform duration-300 md:translate-x-0 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      } dark:bg-gray-900 dark:border-gray-700`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">H</span>
            </div>
            <div>
              <h1 className="font-bold text-2xl text-gray-900 dark:text-white">HNP Tech</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Flow Platform</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={20} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800">
              <div className="w-9 h-9 bg-gray-300 rounded-full"></div>
              <div>
                <p className="font-medium text-sm dark:text-white">Văn Định Nguyễn</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
            >
              {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}