/**
 * Feedback Form Page
 * Collect user testing feedback
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card';
import { Input, TextArea, Select } from '../components/Input';
import { Toast } from '../components/Toast';
import { Tabs } from '../components/Tabs';

export const FeedbackForm: React.FC = () => {
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    deviceBrowser: '',
    testingDuration: '',
    overallRating: '3',
    issuCount: '0',
    criticalIssues: '0',
    highIssues: '0',
    mediumIssues: '0',
    lowIssues: '0',
    mainFeedback: '',
    wouldRecommend: 'maybe',
    likesMost: '',
    couldImprove: '',
    missingFeatures: '',
    featureSuggestions: '',
    designRating: 'good',
    layoutIntuitive: 'yes',
    colorsAppealing: 'yes',
    designImprovements: '',
    feelFast: 'yes',
    slowAreas: '',
    freezingLag: '',
    navigationEasy: 'yes',
    keyboardOnly: 'yes',
    textReadable: 'yes',
    accessibilityIssues: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.mainFeedback) {
      setToast({
        variant: 'error',
        title: 'Missing Information',
        message: 'Please fill in name, email, and main feedback',
      });
      return;
    }

    // In a real app, this would submit to a backend
    console.log('Submitting feedback:', formData);

    setToast({
      variant: 'success',
      title: 'Thank You!',
      message: 'Your feedback has been submitted successfully',
      duration: 3000,
    });

    // Reset form
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 2000);
  };

  const tabs = [
    {
      id: 'general',
      label: 'General',
      icon: '📋',
      content: (
        <div className="space-y-6">
          <Input
            label="Name"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />

          <Input
            label="Email"
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />

          <Input
            label="Device/Browser"
            placeholder="e.g., MacBook Pro - Chrome 120"
            value={formData.deviceBrowser}
            onChange={(e) => handleInputChange('deviceBrowser', e.target.value)}
            hint="Include device type and browser version"
          />

          <Input
            label="Testing Duration"
            type="number"
            placeholder="e.g., 45"
            value={formData.testingDuration}
            onChange={(e) => handleInputChange('testingDuration', e.target.value)}
            hint="In minutes"
          />

          <Select
            label="Overall Rating"
            options={[
              { value: '1', label: '1 - Poor' },
              { value: '2', label: '2 - Below Average' },
              { value: '3', label: '3 - Average' },
              { value: '4', label: '4 - Good' },
              { value: '5', label: '5 - Excellent' },
            ]}
            value={formData.overallRating}
            onChange={(e) => handleInputChange('overallRating', e.target.value)}
          />

          <Select
            label="Would You Recommend?"
            options={[
              { value: 'yes', label: 'Yes, definitely' },
              { value: 'maybe', label: 'Maybe' },
              { value: 'no', label: 'No' },
            ]}
            value={formData.wouldRecommend}
            onChange={(e) => handleInputChange('wouldRecommend', e.target.value)}
          />
        </div>
      ),
    },
    {
      id: 'issues',
      label: 'Issues Found',
      icon: '🐛',
      content: (
        <div className="space-y-6">
          <Input
            label="Total Issues Found"
            type="number"
            placeholder="0"
            value={formData.issuCount}
            onChange={(e) => handleInputChange('issuCount', e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Critical"
              type="number"
              placeholder="0"
              value={formData.criticalIssues}
              onChange={(e) => handleInputChange('criticalIssues', e.target.value)}
            />
            <Input
              label="High"
              type="number"
              placeholder="0"
              value={formData.highIssues}
              onChange={(e) => handleInputChange('highIssues', e.target.value)}
            />
            <Input
              label="Medium"
              type="number"
              placeholder="0"
              value={formData.mediumIssues}
              onChange={(e) => handleInputChange('mediumIssues', e.target.value)}
            />
            <Input
              label="Low"
              type="number"
              placeholder="0"
              value={formData.lowIssues}
              onChange={(e) => handleInputChange('lowIssues', e.target.value)}
            />
          </div>

          <TextArea
            label="Main Feedback"
            placeholder="Please describe any issues or feedback..."
            value={formData.mainFeedback}
            onChange={(e) => handleInputChange('mainFeedback', e.target.value)}
            required
          />
        </div>
      ),
    },
    {
      id: 'features',
      label: 'Features',
      icon: '⭐',
      content: (
        <div className="space-y-6">
          <TextArea
            label="What Did You Like Most?"
            placeholder="Describe your favorite features or aspects..."
            value={formData.likesMost}
            onChange={(e) => handleInputChange('likesMost', e.target.value)}
          />

          <TextArea
            label="What Could Be Improved?"
            placeholder="Suggest improvements..."
            value={formData.couldImprove}
            onChange={(e) => handleInputChange('couldImprove', e.target.value)}
          />

          <TextArea
            label="Missing Features"
            placeholder="What features would you like to see?..."
            value={formData.missingFeatures}
            onChange={(e) => handleInputChange('missingFeatures', e.target.value)}
          />

          <TextArea
            label="Feature Suggestions"
            placeholder="Any other suggestions?..."
            value={formData.featureSuggestions}
            onChange={(e) => handleInputChange('featureSuggestions', e.target.value)}
          />
        </div>
      ),
    },
    {
      id: 'design',
      label: 'Design',
      icon: '🎨',
      content: (
        <div className="space-y-6">
          <Select
            label="How Do You Feel About the Design?"
            options={[
              { value: 'love', label: 'Love it' },
              { value: 'good', label: 'Good' },
              { value: 'okay', label: 'Okay' },
              { value: 'dislike', label: 'Dislike' },
            ]}
            value={formData.designRating}
            onChange={(e) => handleInputChange('designRating', e.target.value)}
          />

          <Select
            label="Is the Layout Intuitive?"
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'somewhat', label: 'Somewhat' },
              { value: 'no', label: 'No' },
            ]}
            value={formData.layoutIntuitive}
            onChange={(e) => handleInputChange('layoutIntuitive', e.target.value)}
          />

          <Select
            label="Are Colors Appealing?"
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
            value={formData.colorsAppealing}
            onChange={(e) => handleInputChange('colorsAppealing', e.target.value)}
          />

          <TextArea
            label="Design Improvements"
            placeholder="Any design suggestions?..."
            value={formData.designImprovements}
            onChange={(e) => handleInputChange('designImprovements', e.target.value)}
          />
        </div>
      ),
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: '⚡',
      content: (
        <div className="space-y-6">
          <Select
            label="Did the App Feel Fast?"
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'somewhat', label: 'Somewhat' },
              { value: 'no', label: 'No' },
            ]}
            value={formData.feelFast}
            onChange={(e) => handleInputChange('feelFast', e.target.value)}
          />

          <TextArea
            label="Slow Areas"
            placeholder="Which pages or features felt slow?..."
            value={formData.slowAreas}
            onChange={(e) => handleInputChange('slowAreas', e.target.value)}
          />

          <TextArea
            label="Freezing/Lag Issues"
            placeholder="Did you experience any freezing or lag?..."
            value={formData.freezingLag}
            onChange={(e) => handleInputChange('freezingLag', e.target.value)}
          />
        </div>
      ),
    },
    {
      id: 'accessibility',
      label: 'Accessibility',
      icon: '♿',
      content: (
        <div className="space-y-6">
          <Select
            label="Was Navigation Easy?"
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'somewhat', label: 'Somewhat' },
              { value: 'no', label: 'No' },
            ]}
            value={formData.navigationEasy}
            onChange={(e) => handleInputChange('navigationEasy', e.target.value)}
          />

          <Select
            label="Could You Use Keyboard Only?"
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'partially', label: 'Partially' },
              { value: 'no', label: 'No' },
            ]}
            value={formData.keyboardOnly}
            onChange={(e) => handleInputChange('keyboardOnly', e.target.value)}
          />

          <Select
            label="Is Text Readable?"
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
            value={formData.textReadable}
            onChange={(e) => handleInputChange('textReadable', e.target.value)}
          />

          <TextArea
            label="Accessibility Issues"
            placeholder="Any accessibility problems?..."
            value={formData.accessibilityIssues}
            onChange={(e) => handleInputChange('accessibilityIssues', e.target.value)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📝 User Feedback Form
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Thank you for testing QRPiPay! Your feedback helps us improve.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="elevated">
            <CardBody>
              <Tabs tabs={tabs} variant="pills" />
            </CardBody>
            <CardFooter>
              <Button variant="outline" onClick={() => window.history.back()}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Submit Feedback
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Info */}
        <motion.div
          className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm text-blue-900 dark:text-blue-100">
            💡 <strong>Note:</strong> Your feedback is valuable to us. All information is
            confidential and used only to improve QRPiPay.
          </p>
        </motion.div>
      </div>

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

export default FeedbackForm;
