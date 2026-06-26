import { useEffect, useState } from 'react';

interface Notification {
  type: string;
  message: string;
  timestamp?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource('http://127.0.0.1:8000/api/notifications/');

    eventSource.onopen = () => {
      setIsConnected(true);
      console.log('✅ SSE Connected');
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications(prev => [data, ...prev].slice(0, 5)); // Giữ 5 thông báo mới nhất
      
      // Toast thông báo
      if (data.message) {
        // Sử dụng toast nếu anh có react-hot-toast
        console.log("🛎️ Notification:", data.message);
      }
    };

    eventSource.onerror = () => {
      console.error("❌ SSE Error");
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return { notifications, isConnected };
};