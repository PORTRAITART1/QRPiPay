import React, { createContext, useContext } from 'react';

interface BrowserContextType {
  isPiBrowser: boolean;
  isReadOnly: boolean;
}

const BrowserContext = createContext<BrowserContextType | undefined>(undefined);

export function BrowserProvider({ children }: { children: React.ReactNode }) {
  // Check for Pi SDK availability (case-sensitive: Pi, not pi)
  const isPiBrowser = !!(window as any).Pi !== undefined;
  const isReadOnly = !isPiBrowser;

  console.log('ðŸŒ BrowserContext initialized:');
  console.log('  - window.Pi available:', !isReadOnly);
  console.log('  - isPiBrowser:', isPiBrowser);

  return (
    <BrowserContext.Provider value={{ isPiBrowser, isReadOnly }}>
      {children}
    </BrowserContext.Provider>
  );
}

export function useBrowser() {
  const context = useContext(BrowserContext);
  if (!context) {
    throw new Error('useBrowser must be used within BrowserProvider');
  }
  return context;
}
