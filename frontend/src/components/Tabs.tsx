/**
 * Tabs Component - Design System
 * Tabbed content interface
 */

import React, { useState } from 'react';
import './Tabs.css';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({
    tabs,
    defaultTab,
    onChange,
    variant = 'default',
  }, ref) => {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    const handleTabClick = (tabId: string) => {
      setActiveTab(tabId);
      onChange?.(tabId);
    };

    const activeTabContent = tabs.find((tab) => tab.id === activeTab);

    return (
      <div ref={ref} className={`tabs tabs-${variant}`}>
        {/* Tab List */}
        <div className="tabs-list" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`
                tab-button
                ${activeTab === tab.id ? 'active' : ''}
                ${tab.disabled ? 'disabled' : ''}
              `.trim()}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tab-panel-${tab.id}`}
              onClick={() => handleTabClick(tab.id)}
              disabled={tab.disabled}
            >
              {tab.icon && <span className="tab-icon">{tab.icon}</span>}
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTabContent && (
          <div
            id={`tab-panel-${activeTab}`}
            className="tab-panel"
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
          >
            {activeTabContent.content}
          </div>
        )}
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';

export default Tabs;
