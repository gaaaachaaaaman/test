// タスクの優先度
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

// タスクのステータス
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';

// タスクタイプ（広告事業特化）
export type TaskType =
  | 'creative' // クリエイティブ制作
  | 'planning' // 企画・提案
  | 'delivery' // 入稿
  | 'analysis' // 分析・レポート
  | 'meeting' // 打ち合わせ
  | 'other'; // その他

// クライアント情報
export interface Client {
  id: string;
  name: string;
  color: string; // カラーコーディング用
  industry?: string; // 業種
}

// キャンペーン情報
export interface Campaign {
  id: string;
  name: string;
  clientId: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  color: string;
}

// タスク
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  type: TaskType;
  clientId?: string;
  campaignId?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  budget?: number; // タスク単位の予算
}

// フィルター設定
export interface FilterSettings {
  status?: TaskStatus[];
  priority?: Priority[];
  type?: TaskType[];
  clientId?: string;
  campaignId?: string;
  searchQuery?: string;
}

// ビューモード
export type ViewMode = 'list' | 'timeline' | 'board';

// アプリの状態
export interface AppState {
  tasks: Task[];
  clients: Client[];
  campaigns: Campaign[];
  filter: FilterSettings;
  viewMode: ViewMode;
}
