'use client';

import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useState, useCallback } from 'react';
import { TEMPLATES } from './data';
import { TemplateCard } from './template-card';
import { TemplatePreviewModal } from './template-preview-modal';
import type { Template, TemplateStrings } from './types';

interface TemplatesGridProps {
  strings: TemplateStrings;
}

export function TemplatesGrid({ strings }: TemplatesGridProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCardClick = useCallback((template: Template) => {
    setSelectedTemplate(template);
    setModalOpen(true);
  }, []);

  const handleModalClose = useCallback((open: boolean) => {
    setModalOpen(open);
    if (!open) {
      // Delay clearing template to allow exit animation
      setTimeout(() => setSelectedTemplate(null), 200);
    }
  }, []);

  // Empty state
  if (TEMPLATES.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col items-center justify-center text-center">
          <RefreshCw className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{strings.empty}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Template Cards */}
          {TEMPLATES.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <TemplateCard
                template={template}
                onClick={() => handleCardClick(template)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      <TemplatePreviewModal
        template={selectedTemplate}
        open={modalOpen}
        onOpenChange={handleModalClose}
        strings={strings}
      />
    </>
  );
}
