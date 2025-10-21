'use client';

import React, { useRef, useState } from 'react';
import { Task, Client, Campaign } from '@/types';
import { formatDate, isDeadlineNear, isOverdue, getNextStatus, getPrevStatus } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';

interface SwipeableTaskCardProps {
  task: Task;
  client?: Client;
  campaign?: Campaign;
}

export function SwipeableTaskCard({ task, client, campaign }: SwipeableTaskCardProps) {
  const { updateTask, deleteTask } = useApp();
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const threshold = 100;

    // 右スワイプ：前のステータスへ
    if (dragOffset > threshold) {
      const prevStatus = getPrevStatus(task.status);
      updateTask(task.id, { status: prevStatus });
    }
    // 左スワイプ：次のステータスへ
    else if (dragOffset < -threshold) {
      const nextStatus = getNextStatus(task.status);
      updateTask(task.id, { status: nextStatus });
    }
    // 下スワイプ（vertical）：削除は別途実装

    setDragOffset(0);
  };

  // 優先度に応じた色
  const priorityColors = {
    urgent: 'bg-red-100 border-red-500',
    high: 'bg-orange-100 border-orange-500',
    medium: 'bg-yellow-100 border-yellow-500',
    low: 'bg-green-100 border-green-500',
  };

  // ステータスに応じたラベル
  const statusLabels = {
    todo: '未着手',
    in_progress: '進行中',
    review: 'レビュー',
    completed: '完了',
  };

  // タスクタイプに応じたアイコン
  const taskTypeIcons = {
    creative: '🎨',
    planning: '📋',
    delivery: '📤',
    analysis: '📊',
    meeting: '💬',
    other: '📌',
  };

  const cardStyle = {
    transform: `translateX(${dragOffset}px)`,
    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
  };

  const showLeftHint = dragOffset > 50;
  const showRightHint = dragOffset < -50;

  return (
    <div className="relative overflow-hidden">
      {/* スワイプヒント背景 */}
      {showLeftHint && (
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-blue-500 flex items-center justify-start pl-4 text-white font-bold">
          ← 戻す
        </div>
      )}
      {showRightHint && (
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-green-500 flex items-center justify-end pr-4 text-white font-bold">
          次へ →
        </div>
      )}

      {/* タスクカード */}
      <div
        className={`relative bg-white rounded-lg border-l-4 ${priorityColors[task.priority]} shadow-md p-4 mb-3 cursor-pointer active:scale-98 transition-transform`}
        style={cardStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* ヘッダー */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{taskTypeIcons[task.type]}</span>
              <h3 className="font-bold text-gray-800 text-lg">{task.title}</h3>
            </div>
            {task.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
            )}
          </div>
        </div>

        {/* メタ情報 */}
        <div className="flex flex-wrap gap-2 text-xs">
          {/* ステータス */}
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
            {statusLabels[task.status]}
          </span>

          {/* クライアント */}
          {client && (
            <span
              className="px-2 py-1 rounded-full font-medium text-white"
              style={{ backgroundColor: client.color }}
            >
              {client.name}
            </span>
          )}

          {/* キャンペーン */}
          {campaign && (
            <span
              className="px-2 py-1 rounded-full font-medium text-white"
              style={{ backgroundColor: campaign.color }}
            >
              {campaign.name}
            </span>
          )}

          {/* 期限 */}
          {task.dueDate && (
            <span
              className={`px-2 py-1 rounded-full font-medium ${
                isOverdue(task.dueDate)
                  ? 'bg-red-100 text-red-800'
                  : isDeadlineNear(task.dueDate)
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              📅 {formatDate(task.dueDate)}
            </span>
          )}

          {/* 予算 */}
          {task.budget && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">
              ¥{task.budget.toLocaleString()}
            </span>
          )}
        </div>

        {/* スワイプヒント（初回のみ表示するとベター） */}
        {!isDragging && (
          <div className="absolute bottom-1 right-2 text-xs text-gray-400">
            ← スワイプで操作 →
          </div>
        )}
      </div>
    </div>
  );
}
