import { Task, Client, Campaign, AppState } from '@/types';

const STORAGE_KEYS = {
  TASKS: 'ad-tasks',
  CLIENTS: 'ad-clients',
  CAMPAIGNS: 'ad-campaigns',
} as const;

// ローカルストレージの操作
class StorageManager {
  // タスクの取得
  getTasks(): Task[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  }

  // タスクの保存
  saveTasks(tasks: Task[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }

  // クライアントの取得
  getClients(): Client[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    return data ? JSON.parse(data) : this.getDefaultClients();
  }

  // クライアントの保存
  saveClients(clients: Client[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }

  // キャンペーンの取得
  getCampaigns(): Campaign[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    return data ? JSON.parse(data) : [];
  }

  // キャンペーンの保存
  saveCampaigns(campaigns: Campaign[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
  }

  // デフォルトのクライアント（初回起動時）
  private getDefaultClients(): Client[] {
    return [
      { id: '1', name: 'サンプル企業A', color: '#6366f1', industry: '小売' },
      { id: '2', name: 'サンプル企業B', color: '#8b5cf6', industry: 'IT' },
      { id: '3', name: 'サンプル企業C', color: '#ec4899', industry: '製造' },
    ];
  }

  // 全データのクリア
  clearAll(): void {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export const storage = new StorageManager();
