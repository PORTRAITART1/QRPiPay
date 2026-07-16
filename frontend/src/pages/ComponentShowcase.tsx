/**
 * Component Showcase Page
 * Interactive demonstration of all design system components
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card';
import { Input, TextArea, Select } from '../components/Input';
import { Badge } from '../components/Badge';
import { Toast } from '../components/Toast';
import { Modal, ModalFooter } from '../components/Modal';
import { Tabs } from '../components/Tabs';
import { Dropdown } from '../components/Dropdown';

export const ComponentShowcase: React.FC = () => {
  const [toast, setToast] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ email: '', message: '' });

  const handleShowToast = (variant: string) => {
    setToast({
      variant,
      title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Message`,
      message: `This is a ${variant} notification example.`,
      duration: 3000,
    });
  };

  const tabs = [
    {
      id: 'buttons',
      label: 'Buttons',
      icon: '🔘',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-4">Variants</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="success">Success</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Sizes</h3>
            <div className="flex flex-wrap gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">States</h3>
            <div className="flex flex-wrap gap-3">
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button fullWidth>Full Width</Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'forms',
      label: 'Forms',
      icon: '📋',
      content: (
        <div className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="user@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            hint="We'll never share your email"
          />

          <TextArea
            label="Message"
            placeholder="Enter your message here..."
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            hint="Maximum 500 characters"
          />

          <Select
            label="Country"
            options={[
              { value: 'fr', label: 'France' },
              { value: 'us', label: 'United States' },
              { value: 'uk', label: 'United Kingdom' },
            ]}
          />
        </div>
      ),
    },
    {
      id: 'badges',
      label: 'Badges',
      icon: '🏷️',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-4">Variants</h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Sizes</h3>
            <div className="flex flex-wrap gap-3">
              <Badge size="sm">Small</Badge>
              <Badge size="md">Medium</Badge>
              <Badge size="lg">Large</Badge>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">With Icons</h3>
            <div className="flex flex-wrap gap-3">
              <Badge icon="✨" variant="primary">
                Starred
              </Badge>
              <Badge icon="✓" variant="success">
                Completed
              </Badge>
              <Badge icon="⚠" variant="warning">
                Warning
              </Badge>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: '🔔',
      content: (
        <div className="space-y-4">
          <Button
            variant="primary"
            onClick={() => handleShowToast('success')}
          >
            Show Success Toast
          </Button>
          <Button variant="danger" onClick={() => handleShowToast('error')}>
            Show Error Toast
          </Button>
          <Button
            variant="warning"
            onClick={() => handleShowToast('warning')}
          >
            Show Warning Toast
          </Button>
          <Button variant="info" onClick={() => handleShowToast('info')}>
            Show Info Toast
          </Button>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              💡 Click any button to see a toast notification appear in the
              bottom-right corner
            </p>
          </div>
        </div>
      ),
    },
  ];

  const dropdownItems = [
    {
      id: 'edit',
      label: 'Edit',
      icon: '✏️',
      onClick: () => handleShowToast('info'),
    },
    {
      id: 'view',
      label: 'View',
      icon: '👁️',
      onClick: () => handleShowToast('info'),
    },
    {
      id: 'divider',
      divider: true,
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: '🗑️',
      onClick: () => handleShowToast('error'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🎨 Component Showcase
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Interactive demonstration of all design system components
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="elevated">
            <CardBody>
              <Tabs tabs={tabs} variant="pills" />
            </CardBody>
          </Card>
        </motion.div>

        {/* Modal Example */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <h2 className="text-2xl font-bold">Modal/Dialog</h2>
            </CardHeader>
            <CardBody>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Open Modal
              </Button>
            </CardBody>
          </Card>
        </motion.div>

        {/* Dropdown Example */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <h2 className="text-2xl font-bold">Dropdown Menu</h2>
            </CardHeader>
            <CardBody>
              <Dropdown
                trigger={<Button variant="outline">⋯ Actions</Button>}
                items={dropdownItems}
              />
            </CardBody>
          </Card>
        </motion.div>

        {/* Cards Example */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="default">
              <CardHeader>Default Card</CardHeader>
              <CardBody>With subtle border and shadow</CardBody>
            </Card>

            <Card variant="elevated">
              <CardHeader>Elevated Card</CardHeader>
              <CardBody>With pronounced shadow</CardBody>
            </Card>

            <Card variant="outlined">
              <CardHeader>Outlined Card</CardHeader>
              <CardBody>With colored border</CardBody>
            </Card>

            <Card variant="accent">
              <CardHeader>Accent Card</CardHeader>
              <CardBody>With gradient background</CardBody>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Example Modal"
        size="md"
      >
        <p className="mb-4">This is a modal dialog component.</p>
        <p className="mb-6">
          You can close it by clicking the X button, clicking outside, or
          pressing Escape.
        </p>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowModal(false);
              handleShowToast('success');
            }}
          >
            Confirm
          </Button>
        </ModalFooter>
      </Modal>

      {/* Toast */}
      {toast && (
        <Toast
          {...toast}
          onClose={() => setToast(null)}
          dismissible
        />
      )}
    </div>
  );
};

export default ComponentShowcase;
