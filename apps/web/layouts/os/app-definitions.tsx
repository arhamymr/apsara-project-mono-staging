'use client';

import ArticleManagerApp from '@/layouts/os/apps/blogs';
import BroadcastEmailApp from '@/layouts/os/apps/BroadcastEmailApp';
import CalculatorApp from '@/layouts/os/apps/CalculatorApp';
import ChatbotApp from '@/layouts/os/apps/ChatbotApp';
import DesktopIconsManagerApp from '@/layouts/os/apps/DesktopIconsManagerApp';
import DesktopSettingsApp from '@/layouts/os/apps/DesktopSettingsApp';
import DockManagerApp from '@/layouts/os/apps/DockManagerApp';
import FinderApp from '@/layouts/os/apps/finder';
import GraphicDesignApp from '@/layouts/os/apps/graphic-design';
import InvoiceApp from '@/layouts/os/apps/InvoiceApp';
import KanbanApp from '@/layouts/os/apps/kanban';
import KnowledgeBaseApp from '@/layouts/os/apps/knowledge-base';
import LanguageConversationApp from '@/layouts/os/apps/LanguageConversationApp';
import LeadManagementApp from '@/layouts/os/apps/LeadManagementApp';
import MailApp from '@/layouts/os/apps/MailApp';
import MapsApp from '@/layouts/os/apps/MapsApp';
import NotesApp from '@/layouts/os/apps/notes';
import PhotosApp from '@/layouts/os/apps/PhotosApp';
import ProductsApp from '@/layouts/os/apps/ProductsApp';
import SketchApp from '@/layouts/os/apps/SketchApp';
import TasksApp from '@/layouts/os/apps/TasksApp';
import UnifiedAnalyticsApp from '@/layouts/os/apps/UnifiedAnalyticsApp';
import VibeCodeApp from '@/layouts/os/apps/VibeCodeApp';
import WebsiteBuilderApp from '@/layouts/os/apps/WebsiteBuilderApp';
import WidgetManagerApp from '@/layouts/os/apps/WidgetManagerApp';

import type { AppDef } from '@/layouts/os/types';

export function createDefaultApps(): AppDef[] {
  return [
    {
      id: 'finder',
      name: 'Finder',
      icon: '📁',
      content: <FinderApp />,
      defaultSize: { width: 900 },
    },
    {
      id: 'language-convo',
      name: 'Language Conversation',
      icon: '🗣️',
      content: <LanguageConversationApp />,
      defaultSize: { width: 357 },
    },
    {
      id: 'widget-manager',
      name: 'Widget Manager',
      icon: '🧩',
      content: <WidgetManagerApp />,
      defaultSize: { width: 760 },
    },
    {
      id: 'desktop-settings',
      name: 'Desktop Settings',
      icon: '🖼️',
      content: <DesktopSettingsApp />,
      defaultSize: { width: 920 },
    },
    {
      id: 'dock-manager',
      name: 'Manage Docks',
      icon: '⚙️',
      content: <DockManagerApp />,
      defaultSize: { width: 920 },
    },
    {
      id: 'desktop-icons',
      name: 'Desktop Icons',
      icon: '🗂️',
      content: <DesktopIconsManagerApp />,
      defaultSize: { width: 480 },
    },

    {
      id: 'graphicdesignerai',
      name: 'Graphic Designer AI',
      icon: '🎨',
      content: <GraphicDesignApp />,
      defaultSize: { width: 800 },
    },
    {
      id: 'articles',
      name: 'Articles',
      icon: '📰',
      content: <ArticleManagerApp />,
      defaultSize: { width: 1100 },
    },
    {
      id: 'calculator',
      name: 'Calculator',
      icon: '🔢',
      content: <CalculatorApp />,
      defaultSize: { width: 400 },
    },
    {
      id: 'products',
      name: 'Products',
      icon: '🛍️',
      content: <ProductsApp />,
      defaultSize: { width: 900 },
    },
    {
      id: 'notes',
      name: 'Notes',
      icon: '📝',
      content: <NotesApp />,
      defaultSize: { width: 900 },
    },
    {
      id: 'sketch',
      name: 'Sketch',
      icon: '✏️',
      content: <SketchApp />,
      defaultSize: { width: 1200, height: 900 },
    },
    {
      id: 'knowledgebase',
      name: 'Knowledge Base',
      icon: '📚',
      content: <KnowledgeBaseApp />,
      defaultSize: { width: 1100 },
    },
    {
      id: 'website-builder',
      name: 'Site Builder',
      icon: '🧩',
      content: <WebsiteBuilderApp />,
      defaultSize: { width: 1200 },
    },
    {
      id: 'chatbot',
      name: 'Chatbot AI',
      icon: '🤖',
      content: <ChatbotApp />,
      defaultSize: { width: 1100 },
    },
    {
      id: 'mail',
      name: 'Mail',
      icon: '📫',
      content: <MailApp />,
      defaultSize: { width: 900 },
    },
    {
      id: 'broadcast-email',
      name: 'Broadcast Email',
      icon: '📧',
      content: <BroadcastEmailApp />,
      defaultSize: { width: 1100 },
    },
    {
      id: 'lead-management',
      name: 'Lead Management',
      icon: '👥',
      content: <LeadManagementApp />,
      defaultSize: { width: 1100 },
    },

    {
      id: 'photos',
      name: 'Photos',
      icon: '🖼️',
      content: <PhotosApp />,
      defaultSize: { width: 1000 },
    },
    {
      id: 'tasks',
      name: 'Tasks',
      icon: '✅',
      content: <TasksApp />,
      defaultSize: { width: 800 },
    },
    {
      id: 'maps',
      name: 'Maps',
      icon: '🗺️',
      content: <MapsApp />,
      defaultSize: { width: 1000 },
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: '📊',
      content: <UnifiedAnalyticsApp />,
      defaultSize: { width: 1200 },
    },
    {
      id: 'vibe-code',
      name: 'Vibe Code',
      icon: '⚡',
      content: <VibeCodeApp />,
      defaultSize: { width: 1200, height: 800 },
    },
    {
      id: 'invoices',
      name: 'Invoices',
      icon: '🧾',
      content: <InvoiceApp />,
      defaultSize: { width: 1100, height: 700 },
    },
    {
      id: 'kanban',
      name: 'Kanban',
      icon: '📋',
      content: <KanbanApp />,
      defaultSize: { width: 1200, height: 800 },
    },
  ];
}
