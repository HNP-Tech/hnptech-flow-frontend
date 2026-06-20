'use client';

import { Bell, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const { user: contextUser, logout } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState(contextUser);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, [contextUser]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (

<header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8 fixed top-0 right-0 left-0 md:left-72 z-50">
    <div className="flex items-center gap-4">
    <h2 className="text-lg font-semibold text-gray-800 md:block hidden">HNP Tech Flow</h2>
    </div>
      <div className="flex items-center gap-6">
        <button className="relative p-2 hover:bg-gray-100 rounded-xl">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-[10px] text-white rounded-full flex items-center justify-center">
            3
          </span>
        </button>
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-medium text-sm">{user.full_name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold">
              {user.full_name.substring(0,1)}
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-gray-100 rounded-xl text-gray-600 hover:text-red-600"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}