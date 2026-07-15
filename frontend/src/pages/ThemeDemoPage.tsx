/**
 * Theme Demo Page
 * Showcase all components in light and dark modes
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card';
import { Input, TextArea, Select } from '../components/Input';
import { Badge } from '../components/Badge';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

export const ThemeDemoPage: React.FC = () => {
  const { effectiveTheme } = useTheme();
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');

  const handleValidate = () => {
    if (!email.includes('@')) {
      setError('Invalid email');
    } else {
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              🎨 Design System Demo
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Current theme: <span className="font-semibold capitalize">{effectiveTheme}</span>
            </p>
          </div>
          <ThemeToggle />
        </motion.div>

        {/* Buttons Section */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <h2 className="text-2xl font-bold">Buttons</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="success">Success</Button>
                <Button variant="danger">Danger</Button>
              </div>

              <div className="mt-6 space-y-2">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Sizes
                </h3>
                <div className="flex gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  States
                </h3>
                <div className="flex gap-4">
                  <Button loading>Loading</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.section>

        {/* Badges Section */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <h2 className="text-2xl font-bold">Badges</h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-3">
                <Badge variant="default">Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="info">Info</Badge>
              </div>

              <div className="mt-6 space-y-2">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Sizes
                </h3>
                <div className="flex gap-3">
                  <Badge size="sm">Small</Badge>
                  <Badge size="md">Medium</Badge>
                  <Badge size="lg">Large</Badge>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  With Icons & Dismissible
                </h3>
                <div className="flex gap-3">
                  <Badge icon="✨" variant="primary">Starred</Badge>
                  <Badge dismissible variant="success">Dismissible</Badge>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.section>

        {/* Cards Section */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="default">
              <CardHeader>Default Card</CardHeader>
              <CardBody>Default variant with subtle border</CardBody>
            </Card>

            <Card variant="elevated">
              <CardHeader>Elevated Card</CardHeader>
              <CardBody>Elevated with shadow effect</CardBody>
            </Card>

            <Card variant="outlined">
              <CardHeader>Outlined Card</CardHeader>
              <CardBody>Outlined with primary border</CardBody>
            </Card>

            <Card variant="accent">
              <CardHeader>Accent Card</CardHeader>
              <CardBody>Accent with gradient background</CardBody>
            </Card>
          </div>
        </motion.section>

        {/* Forms Section */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <h2 className="text-2xl font-bold">Form Components</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={error}
                  hint="We'll never share your email"
                  placeholder="user@example.com"
                />

                <Input
                  label="Phone"
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                  hint="Include country code"
                />

                <TextArea
                  label="Message"
                  placeholder="Enter your message here..."
                  hint="Maximum 500 characters"
                />

                <Select
                  label="Country"
                  options={[
                    { value: 'fr', label: 'France' },
                    { value: 'us', label: 'United States' },
                    { value: 'uk', label: 'United Kingdom' },
                    { value: 'de', label: 'Germany' },
                  ]}
                />

                <div className="flex gap-4">
                  <Button variant="primary" onClick={handleValidate}>
                    Validate
                  </Button>
                  <Button variant="outline">
                    Reset
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.section>

        {/* Colors Section */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <h2 className="text-2xl font-bold">Colors</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="h-20 bg-primary rounded-lg shadow-md"></div>
                <div className="h-20 bg-secondary rounded-lg shadow-md"></div>
                <div className="h-20 bg-success rounded-lg shadow-md"></div>
                <div className="h-20 bg-error rounded-lg shadow-md"></div>
                <div className="h-20 bg-warning rounded-lg shadow-md"></div>
                <div className="h-20 bg-info rounded-lg shadow-md"></div>
              </div>
            </CardBody>
          </Card>
        </motion.section>

        {/* Footer */}
        <motion.div
          className="text-center text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p>🎨 Design system is fully responsive and supports light/dark modes</p>
        </motion.div>
      </div>
    </div>
  );
};

export default ThemeDemoPage;
