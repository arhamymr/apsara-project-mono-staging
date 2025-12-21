'use client';

import { ApiHubHeader } from './components/api-hub-header';
import { OverviewTab } from './components/overview-tab';
import { ApiKeysTab } from './components/api-keys-tab';
import { DocsTab } from './components/docs-tab';
import { TestingTab } from './components/testing-tab';
import { CreateKeyModal } from './components/create-key-modal';
import { useApiHub } from './hooks/useApiHub';

export default function ApiHubApp() {
  const {
    activeTab,
    setActiveTab,
    apiKeys,
    stats,
    isKeyModalOpen,
    setIsKeyModalOpen,
    newKeyValue,
    setNewKeyValue,
    createApiKey,
    toggleApiKey,
    deleteApiKey,
  } = useApiHub();

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <ApiHubHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        stats={stats}
      />

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'overview' && <OverviewTab stats={stats} />}
        
        {activeTab === 'keys' && (
          <ApiKeysTab
            apiKeys={apiKeys}
            onCreateKey={() => setIsKeyModalOpen(true)}
            onToggleKey={toggleApiKey}
            onDeleteKey={deleteApiKey}
          />
        )}
        
        {activeTab === 'docs' && <DocsTab />}
        
        {activeTab === 'testing' && <TestingTab />}
      </div>

      {/* Inline Modal - renders inside the window */}
      <CreateKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onCreate={createApiKey}
        newKeyValue={newKeyValue}
        onClearNewKey={() => setNewKeyValue(null)}
      />
    </div>
  );
}
