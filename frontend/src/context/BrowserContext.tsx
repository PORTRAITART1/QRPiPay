import React, { createContext, useContext } from 'react';

interface BrowserContextType {
  isPiBrowser: boolean;
  isReadOnly: boolean;
}

const BrowserContext = createContext<BrowserContextType | undefined>(undefined);

export function BrowserProvider({ children }: { children: React.ReactNode }) {
  const isPiBrowser = !!(window as any).pi !== undefined;
  const isReadOnly = !isPiBrowser;

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
