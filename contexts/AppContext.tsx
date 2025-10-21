'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, Client, Campaign, FilterSettings, ViewMode } from '@/types';
import { storage } from '@/lib/storage';
import { generateId } from '@/lib/utils';

interface AppContextType {
  tasks: Task[];
  clients: Client[];
  campaigns: Campaign[];
  filter: FilterSettings;
  viewMode: ViewMode;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  addCampaign: (campaign: Omit<Campaign, 'id'>) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  setFilter: (filter: FilterSettings) => void;
  setViewMode: (mode: ViewMode) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filter, setFilter] = useState<FilterSettings>({});
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // 初期化：ローカルストレージからデータを読み込む
  useEffect(() => {
    setTasks(storage.getTasks());
    setClients(storage.getClients());
    setCampaigns(storage.getCampaigns());
  }, []);

  // タスクの追加
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
  };

  // タスクの更新
  const updateTask = (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    );
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
  };

  // タスクの削除
  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
  };

  // クライアントの追加
  const addClient = (clientData: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...clientData,
      id: generateId(),
    };
    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    storage.saveClients(updatedClients);
  };

  // クライアントの更新
  const updateClient = (id: string, updates: Partial<Client>) => {
    const updatedClients = clients.map(client =>
      client.id === id ? { ...client, ...updates } : client
    );
    setClients(updatedClients);
    storage.saveClients(updatedClients);
  };

  // キャンペーンの追加
  const addCampaign = (campaignData: Omit<Campaign, 'id'>) => {
    const newCampaign: Campaign = {
      ...campaignData,
      id: generateId(),
    };
    const updatedCampaigns = [...campaigns, newCampaign];
    setCampaigns(updatedCampaigns);
    storage.saveCampaigns(updatedCampaigns);
  };

  // キャンペーンの更新
  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    const updatedCampaigns = campaigns.map(campaign =>
      campaign.id === id ? { ...campaign, ...updates } : campaign
    );
    setCampaigns(updatedCampaigns);
    storage.saveCampaigns(updatedCampaigns);
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        clients,
        campaigns,
        filter,
        viewMode,
        addTask,
        updateTask,
        deleteTask,
        addClient,
        updateClient,
        addCampaign,
        updateCampaign,
        setFilter,
        setViewMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
