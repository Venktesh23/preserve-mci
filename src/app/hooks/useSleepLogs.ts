import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/storage';

/**
 * Sleep Log Data Structure (imported from SleepLogModal)
 */
export interface SleepLogData {
  id?: string; // Add unique ID for each log
  date: string;
  hoursSlept: number;
  sleepQuality: number;
  notes: string;
  bedtime?: string;
  waketime?: string;
  timeOutOfBed?: string;
  napMinutes?: number;
  napTimeOfDay?: string;
  timeToFallAsleep?: number;
  nightAwakenings?: number;
  timeAwakeDuringNight?: number;
  totalSleepMinutes?: number | null;
  sleepEfficiency?: number | null;
  totalWakeMinutes?: number | null;
}

/**
 * Sleep Logs Storage
 */
export interface SleepLogsStorage {
  logs: SleepLogData[];
}

/**
 * Sleep Statistics
 */
export interface SleepStats {
  averageHours: number;
  averageQuality: number;
  totalLogs: number;
  currentStreak: number;
  bestNight: SleepLogData | null;
  worstNight: SleepLogData | null;
  last7Days: SleepLogData[];
}

/**
 * Hook for managing sleep logs with localStorage persistence
 * Provides functions for adding, editing, deleting, and analyzing sleep data
 */
export function useSleepLogs() {
  const [storage, setStorage] = useLocalStorage<SleepLogsStorage>(
    STORAGE_KEYS.SLEEP_LOGS,
    { logs: [] }
  );

  /**
   * Add a new sleep log
   */
  const addSleepLog = useCallback(
    (logData: Omit<SleepLogData, 'id'>) => {
      const newLog: SleepLogData = {
        ...logData,
        id: generateId(),
      };

      setStorage((prev) => ({
        logs: [newLog, ...prev.logs].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
      }));

      return newLog;
    },
    [setStorage]
  );

  /**
   * Update an existing sleep log
   */
  const updateSleepLog = useCallback(
    (id: string, updates: Partial<SleepLogData>) => {
      setStorage((prev) => ({
        logs: prev.logs.map((log) =>
          log.id === id ? { ...log, ...updates } : log
        ),
      }));
    },
    [setStorage]
  );

  /**
   * Delete a sleep log
   */
  const deleteSleepLog = useCallback(
    (id: string) => {
      setStorage((prev) => ({
        logs: prev.logs.filter((log) => log.id !== id),
      }));
    },
    [setStorage]
  );

  /**
   * Get sleep logs for a specific date range
   */
  const getLogsByDateRange = useCallback(
    (startDate: Date, endDate: Date) => {
      return storage.logs.filter((log) => {
        const logDate = new Date(log.date);
        return logDate >= startDate && logDate <= endDate;
      });
    },
    [storage.logs]
  );

  /**
   * Get last N days of sleep logs
   */
  const getLastNDays = useCallback(
    (days: number) => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      return getLogsByDateRange(startDate, endDate);
    },
    [getLogsByDateRange]
  );

  /**
   * Calculate sleep statistics
   */
  const stats: SleepStats = useMemo(() => {
    const logs = storage.logs;

    if (logs.length === 0) {
      return {
        averageHours: 0,
        averageQuality: 0,
        totalLogs: 0,
        currentStreak: 0,
        bestNight: null,
        worstNight: null,
        last7Days: [],
      };
    }

    // Calculate averages
    const totalHours = logs.reduce((sum, log) => sum + log.hoursSlept, 0);
    const totalQuality = logs.reduce((sum, log) => sum + log.sleepQuality, 0);
    const averageHours = totalHours / logs.length;
    const averageQuality = totalQuality / logs.length;

    // Find best and worst nights (by quality)
    const sortedByQuality = [...logs].sort((a, b) => b.sleepQuality - a.sleepQuality);
    const bestNight = sortedByQuality[0];
    const worstNight = sortedByQuality[sortedByQuality.length - 1];

    // Calculate current streak (consecutive days with logs)
    const currentStreak = calculateCurrentStreak(logs);

    // Get last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const last7Days = logs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= startDate && logDate <= endDate;
    });

    return {
      averageHours: Math.round(averageHours * 10) / 10,
      averageQuality: Math.round(averageQuality * 10) / 10,
      totalLogs: logs.length,
      currentStreak,
      bestNight,
      worstNight,
      last7Days,
    };
  }, [storage.logs]);

  /**
   * Get chart data for last N days
   */
  const getChartData = useCallback(
    (days: number = 7) => {
      const logs = getLastNDays(days);
      const endDate = new Date();
      const chartData = [];

      // Create array of last N days
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(endDate);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        // Find log for this date
        const log = logs.find((l) => l.date.split('T')[0] === dateStr);

        // Use fullDate as the unique identifier for React keys
        chartData.push({
          id: dateStr, // Unique identifier for React keys
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          fullDate: dateStr,
          hours: log && typeof log.totalSleepMinutes === 'number' ? Number((log.totalSleepMinutes / 60).toFixed(1)) : 0,
          sleepEfficiency: log && typeof log.sleepEfficiency === 'number' ? log.sleepEfficiency : null,
          totalWakeMinutes: log && typeof log.totalWakeMinutes === 'number' ? log.totalWakeMinutes : null,
          hasData: !!log && typeof log.totalSleepMinutes === 'number',
        });
      }

      return chartData;
    },
    [getLastNDays]
  );

  /**
   * Clear all sleep logs
   */
  const clearAllLogs = useCallback(() => {
    setStorage({ logs: [] });
  }, [setStorage]);

  /**
   * Export logs as JSON
   */
  const exportLogs = useCallback(() => {
    return JSON.stringify(storage.logs, null, 2);
  }, [storage.logs]);

  return {
    // Data
    logs: storage.logs,
    stats,

    // Actions
    addSleepLog,
    updateSleepLog,
    deleteSleepLog,
    clearAllLogs,

    // Queries
    getLogsByDateRange,
    getLastNDays,
    getChartData,
    exportLogs,
  };
}

/**
 * Calculate consecutive days streak
 */
function calculateCurrentStreak(logs: SleepLogData[]): number {
  if (logs.length === 0) return 0;

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const log of sortedLogs) {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === streak) {
      streak++;
      currentDate = logDate;
    } else if (diffDays > streak) {
      break;
    }
  }

  return streak;
}

/**
 * Generate unique ID for sleep log
 */
function generateId(): string {
  return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}