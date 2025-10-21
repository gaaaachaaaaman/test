import { Task, FilterSettings, Priority, TaskStatus } from '@/types';

// タスクのフィルタリング
export function filterTasks(tasks: Task[], filter: FilterSettings): Task[] {
  return tasks.filter(task => {
    // ステータスフィルター
    if (filter.status && filter.status.length > 0) {
      if (!filter.status.includes(task.status)) return false;
    }

    // 優先度フィルター
    if (filter.priority && filter.priority.length > 0) {
      if (!filter.priority.includes(task.priority)) return false;
    }

    // タスクタイプフィルター
    if (filter.type && filter.type.length > 0) {
      if (!filter.type.includes(task.type)) return false;
    }

    // クライアントフィルター
    if (filter.clientId && task.clientId !== filter.clientId) {
      return false;
    }

    // キャンペーンフィルター
    if (filter.campaignId && task.campaignId !== filter.campaignId) {
      return false;
    }

    // 検索クエリフィルター
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(query);
      const descMatch = task.description?.toLowerCase().includes(query);
      if (!titleMatch && !descMatch) return false;
    }

    return true;
  });
}

// タスクのソート
export function sortTasks(tasks: Task[]): Task[] {
  const priorityOrder: Record<Priority, number> = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  return [...tasks].sort((a, b) => {
    // 優先度でソート
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // 期限でソート
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;

    // 作成日でソート
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

// 日付のフォーマット
export function formatDate(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '今日';
  if (diffDays === 1) return '明日';
  if (diffDays === -1) return '昨日';
  if (diffDays > 0 && diffDays <= 7) return `${diffDays}日後`;
  if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)}日前`;

  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
}

// 期限が近いかチェック
export function isDeadlineNear(dateString?: string): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 3;
}

// 期限切れかチェック
export function isOverdue(dateString?: string): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  const now = new Date();
  return date < now;
}

// ユニークIDの生成
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ステータスの次の状態を取得
export function getNextStatus(current: TaskStatus): TaskStatus {
  const statusFlow: TaskStatus[] = ['todo', 'in_progress', 'review', 'completed'];
  const currentIndex = statusFlow.indexOf(current);
  return statusFlow[(currentIndex + 1) % statusFlow.length];
}

// ステータスの前の状態を取得
export function getPrevStatus(current: TaskStatus): TaskStatus {
  const statusFlow: TaskStatus[] = ['todo', 'in_progress', 'review', 'completed'];
  const currentIndex = statusFlow.indexOf(current);
  return statusFlow[(currentIndex - 1 + statusFlow.length) % statusFlow.length];
}
