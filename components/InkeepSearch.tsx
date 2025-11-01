'use client';

import { useEffect, useState } from 'react';
import type { InkeepCustomTriggerProps } from '@inkeep/widgets';

// Inkeep AI Search Configuration
// You'll need to replace these with your actual Inkeep configuration
const INKEEP_CONFIG = {
  baseSettings: {
    apiKey: process.env.NEXT_PUBLIC_INKEEP_API_KEY || '', // Add your Inkeep API key to environment variables
    integrationId: process.env.NEXT_PUBLIC_INKEEP_INTEGRATION_ID || '', // Add your Integration ID
    organizationId: process.env.NEXT_PUBLIC_INKEEP_ORGANIZATION_ID || '', // Add your Organization ID
    organizationDisplayName: 'Payvost',
    primaryBrandColor: '#000000',
  },
  aiChatSettings: {
    botAvatarSrcUrl: '/payvost-logo.png', // Optional: Add your logo
    quickQuestions: [
      'How do I integrate Payvost payments?',
      'What are the API authentication methods?',
      'How do I handle webhooks?',
    ],
  },
  searchSettings: {
    placeholder: 'Search documentation...',
  },
  modalSettings: {
    isShortcutKeyEnabled: true,
  },
};

export function InkeepSearch() {
  const [InkeepWidget, setInkeepWidget] = useState<any>(null);

  useEffect(() => {
    // Dynamically import Inkeep widget only on client-side
    if (typeof window !== 'undefined') {
      import('@inkeep/widgets').then((module) => {
        setInkeepWidget(() => module.InkeepCustomTrigger);
      });
    }
  }, []);

  // If API keys are not configured, return null
  if (!INKEEP_CONFIG.baseSettings.apiKey) {
    return null;
  }

  // Return null while loading or if widget is not available
  if (!InkeepWidget) {
    return null;
  }

  return (
    <InkeepWidget
      isOpen={false}
      onClose={() => {}}
      baseSettings={INKEEP_CONFIG.baseSettings}
      aiChatSettings={INKEEP_CONFIG.aiChatSettings}
      searchSettings={INKEEP_CONFIG.searchSettings}
      modalSettings={INKEEP_CONFIG.modalSettings}
    />
  );
}

export default InkeepSearch;
