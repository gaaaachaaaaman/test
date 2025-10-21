'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { SwipeableTaskCard } from '@/components/SwipeableTaskCard';
import { FilterBar } from '@/components/FilterBar';
import { TaskForm } from '@/components/TaskForm';
import { filterTasks, sortTasks } from '@/lib/utils';

export default function Home() {
  const { tasks, clients, campaigns, filter } = useApp();
  const [showTaskForm, setShowTaskForm] = useState(false);

  // フィルタリングとソート
  const filteredAndSortedTasks = useMemo(() => {
    const filtered = filterTasks(tasks, filter);
    return sortTasks(filtered);
  }, [tasks, filter]);

  // 統計情報
  const stats = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      review: tasks.filter(t => t.status === 'review').length,
      completed: tasks.filter(t => t.status === 'completed').length,
    };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ヘッダー */}
      <header className="gradient-bg text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-3">広告タスク管理</h1>

          {/* 統計バー */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-white bg-opacity-20 rounded-lg p-2">
              <div className="text-xs opacity-90">未着手</div>
              <div className="text-xl font-bold">{stats.todo}</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-2">
              <div className="text-xs opacity-90">進行中</div>
              <div className="text-xl font-bold">{stats.inProgress}</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-2">
              <div className="text-xs opacity-90">レビュー</div>
              <div className="text-xl font-bold">{stats.review}</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-2">
              <div className="text-xs opacity-90">完了</div>
              <div className="text-xl font-bold">{stats.completed}</div>
            </div>
          </div>
        </div>
      </header>

      {/* フィルターバー */}
      <FilterBar />

      {/* タスクリスト */}
      <main className="max-w-4xl mx-auto px-4 py-4">
        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-500 text-lg mb-2">
              {tasks.length === 0 ? 'タスクがありません' : 'フィルター条件に一致するタスクがありません'}
            </p>
            <p className="text-gray-400 text-sm">
              {tasks.length === 0 && '右下の＋ボタンからタスクを追加しましょう'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAndSortedTasks.map(task => {
              const client = clients.find(c => c.id === task.clientId);
              const campaign = campaigns.find(c => c.id === task.campaignId);
              return (
                <SwipeableTaskCard
                  key={task.id}
                  task={task}
                  client={client}
                  campaign={campaign}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* フローティングアクションボタン */}
      <button
        onClick={() => setShowTaskForm(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-ad-primary text-white rounded-full shadow-lg hover:bg-ad-secondary transition-all hover:scale-110 active:scale-95 flex items-center justify-center text-3xl z-40"
        aria-label="新規タスク作成"
      >
        +
      </button>

      {/* タスク作成フォーム */}
      {showTaskForm && <TaskForm onClose={() => setShowTaskForm(false)} />}

      {/* 使い方ヒント（初回のみ表示するとベター） */}
      {tasks.length > 0 && (
        <div className="fixed bottom-24 right-6 bg-white rounded-lg shadow-lg p-3 text-xs text-gray-600 max-w-[200px] z-30 border-2 border-ad-primary animate-fadeIn">
          <div className="font-bold mb-1">💡 使い方</div>
          <div>タスクを左右にスワイプでステータス変更！</div>
        </div>
      )}
    </div>
  );
}
