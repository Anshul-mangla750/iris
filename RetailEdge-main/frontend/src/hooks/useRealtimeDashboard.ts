import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { DashboardOverviewData } from '../types/dashboard';

interface RealtimeConfig {
  storeId?: string;
  onUpdate?: (partialData: Partial<DashboardOverviewData>) => void;
}

export function useRealtimeDashboard({ storeId = 'store-001', onUpdate }: RealtimeConfig) {
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  useEffect(() => {
    // When served via Vite proxy or direct port, connect to current host or fallback 5000
    const socketUrl =
      import.meta.env.VITE_SOCKET_URL ||
      (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000');

    let socket: Socket | null = null;
    try {
      socket = io(socketUrl, {
        autoConnect: true,
        transports: ['websocket', 'polling'],
        path: '/socket.io',
        query: { storeId },
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
      });

      socket.on('connect', () => {
        socket?.emit('subscribe:dashboard', storeId);
      });

      socket.on('dashboard:tick', (payload) => {
        if (onUpdateRef.current && payload) {
          onUpdateRef.current(payload);
        }
      });

      socket.on('metrics:live', (payload) => {
        if (onUpdateRef.current && payload) {
          onUpdateRef.current(payload);
        }
      });

      socket.on('queue:update', (counters) => {
        if (onUpdateRef.current && Array.isArray(counters)) {
          onUpdateRef.current({
            queueCounters: counters.map((c: any) => ({
              id: c.id,
              name: c.name,
              peopleCount: c.currentQueue ?? c.peopleCount ?? 0,
              waitTimeMinutes: Math.round(c.avgWaitTime ?? c.waitTimeMinutes ?? 0),
              status: c.status || 'Normal',
              capacityPercent: Math.min(100, Math.round(((c.currentQueue ?? 5) / 10) * 100)),
            })),
          });
        }
      });

      socket.on('analytics.updated', (payload) => {
        if (onUpdateRef.current && payload) {
          onUpdateRef.current(payload);
        }
      });
    } catch {
      // Fail silently if socket server cannot be reached
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [storeId]);
}

export default useRealtimeDashboard;
