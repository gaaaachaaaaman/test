'use client';

import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { TaskStatus, Priority, TaskType } from '@/types';

export function FilterBar() {
  const { filter, setFilter, clients, campaigns } = useApp();

  const statusOptions: { value: TaskStatus; label: string; emoji: string }[] = [
    { value: 'todo', label: '未着手', emoji: '⭕' },
    { value: 'in_progress', label: '進行中', emoji: '🔄' },
    { value: 'review', label: 'レビュー', emoji: '👀' },
    { value: 'completed', label: '完了', emoji: '✅' },
  ];

  const priorityOptions: { value: Priority; label: string; emoji: string }[] = [
    { value: 'urgent', label: '緊急', emoji: '🔥' },
    { value: 'high', label: '高', emoji: '⬆️' },
    { value: 'medium', label: '中', emoji: '➡️' },
    { value: 'low', label: '低', emoji: '⬇️' },
  ];

  const typeOptions: { value: TaskType; label: string; emoji: string }[] = [
    { value: 'creative', label: '制作', emoji: '🎨' },
    { value: 'planning', label: '企画', emoji: '📋' },
    { value: 'delivery', label: '入稿', emoji: '📤' },
    { value: 'analysis', label: '分析', emoji: '📊' },
    { value: 'meeting', label: '打合せ', emoji: '💬' },
    { value: 'other', label: 'その他', emoji: '📌' },
  ];

  const toggleStatus = (status: TaskStatus) => {
    const current = filter.status || [];
    const updated = current.includes(status)
      ? current.filter(s => s !== status)
      : [...current, status];
    setFilter({ ...filter, status: updated.length > 0 ? updated : undefined });
  };

  const togglePriority = (priority: Priority) => {
    const current = filter.priority || [];
    const updated = current.includes(priority)
      ? current.filter(p => p !== priority)
      : [...current, priority];
    setFilter({ ...filter, priority: updated.length > 0 ? updated : undefined });
  };

  const toggleType = (type: TaskType) => {
    const current = filter.type || [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    setFilter({ ...filter, type: updated.length > 0 ? updated : undefined });
  };

  const clearFilters = () => {
    setFilter({});
  };

  const hasActiveFilters =
    (filter.status && filter.status.length > 0) ||
    (filter.priority && filter.priority.length > 0) ||
    (filter.type && filter.type.length > 0) ||
    filter.clientId ||
    filter.campaignId ||
    filter.searchQuery;

  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="p-3 space-y-3">
        {/* 検索バー */}
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 タスクを検索..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ad-primary"
            value={filter.searchQuery || ''}
            onChange={(e) => setFilter({ ...filter, searchQuery: e.target.value || undefined })}
          />
        </div>

        {/* ステータスフィルター */}
        <div>
          <div className="text-xs text-gray-600 mb-1 font-medium">ステータス</div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {statusOptions.map(option => (
              <button
                key={option.value}
                onClick={() => toggleStatus(option.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  filter.status?.includes(option.value)
                    ? 'bg-ad-primary text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {option.emoji} {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 優先度フィルター */}
        <div>
          <div className="text-xs text-gray-600 mb-1 font-medium">優先度</div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {priorityOptions.map(option => (
              <button
                key={option.value}
                onClick={() => togglePriority(option.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  filter.priority?.includes(option.value)
                    ? 'bg-ad-secondary text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {option.emoji} {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* タスクタイプフィルター */}
        <div>
          <div className="text-xs text-gray-600 mb-1 font-medium">タイプ</div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {typeOptions.map(option => (
              <button
                key={option.value}
                onClick={() => toggleType(option.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  filter.type?.includes(option.value)
                    ? 'bg-ad-accent text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {option.emoji} {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* クライアントフィルター */}
        {clients.length > 0 && (
          <div>
            <div className="text-xs text-gray-600 mb-1 font-medium">クライアント</div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {clients.map(client => (
                <button
                  key={client.id}
                  onClick={() => setFilter({
                    ...filter,
                    clientId: filter.clientId === client.id ? undefined : client.id
                  })}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors text-white`}
                  style={{
                    backgroundColor: filter.clientId === client.id ? client.color : '#9ca3af',
                  }}
                >
                  {client.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* フィルタークリアボタン */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            🔄 フィルターをクリア
          </button>
        )}
      </div>
    </div>
  );
}
