'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Permission } from '../types';

type TabType = 'overview' | 'keys' | 'docs' | 'testing';

export function useApiHub() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  // Modal states
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<Id<'apiKeys'> | null>(null);
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null);

  // Convex queries
  const apiKeysData = useQuery(api.apiKeys.listApiKeys);
  const apiKeys = useMemo(() => apiKeysData ?? [], [apiKeysData]);
  const usageStats = useQuery(api.apiKeys.getUsageStats);

  // Convex mutations
  const createApiKeyAction = useAction(api.apiKeys.createApiKey);
  const toggleApiKeyMutation = useMutation(api.apiKeys.toggleApiKey);
  const deleteApiKeyMutation = useMutation(api.apiKeys.deleteApiKey);
  const updateApiKeyMutation = useMutation(api.apiKeys.updateApiKey);

  // Stats derived from Convex data
  const stats = useMemo(() => ({
    totalKeys: usageStats?.totalKeys ?? apiKeys.length,
    activeKeys: usageStats?.activeKeys ?? apiKeys.filter(k => k.isActive).length,
    requestsToday: usageStats?.requestsToday ?? 0,
    requestsThisMonth: usageStats?.requestsThisMonth ?? 0,
    topEndpoints: usageStats?.topEndpoints ?? [],
    errorRate: usageStats?.errorRate ?? 0,
  }), [apiKeys, usageStats]);

  // API Key actions
  const createApiKey = async (data: { 
    name: string; 
    permissions: Permission[]; 
    rateLimit: number; 
    expiresIn?: number 
  }) => {
    try {
      const result = await createApiKeyAction({
        name: data.name,
        permissions: data.permissions,
        rateLimit: data.rateLimit,
        expiresInDays: data.expiresIn,
      });
      
      // Show the key value (only shown once)
      setNewKeyValue(result.key);
      return result;
    } catch (error) {
      console.error('Failed to create API key:', error);
      throw error;
    }
  };

  const updateApiKey = async (id: Id<'apiKeys'>, updates: { 
    name?: string; 
    permissions?: Permission[]; 
    rateLimit?: number 
  }) => {
    try {
      await updateApiKeyMutation({
        id,
        ...updates,
      });
    } catch (error) {
      console.error('Failed to update API key:', error);
      throw error;
    }
  };

  const deleteApiKey = async (id: Id<'apiKeys'>) => {
    try {
      await deleteApiKeyMutation({ id });
    } catch (error) {
      console.error('Failed to delete API key:', error);
      throw error;
    }
  };

  const toggleApiKey = async (id: Id<'apiKeys'>) => {
    try {
      await toggleApiKeyMutation({ id });
    } catch (error) {
      console.error('Failed to toggle API key:', error);
      throw error;
    }
  };

  return {
    // State
    activeTab,
    setActiveTab,
    apiKeys,
    stats,
    
    // Modal states
    isKeyModalOpen,
    setIsKeyModalOpen,
    editingKey,
    setEditingKey,
    newKeyValue,
    setNewKeyValue,
    
    // API Key actions
    createApiKey,
    updateApiKey,
    deleteApiKey,
    toggleApiKey,
  };
}
