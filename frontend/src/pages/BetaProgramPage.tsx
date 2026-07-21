/**
 * 🧪 Beta Program Landing Page
 * Recruit beta testers for QRPiPay v2.0
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ButtonPremium } from '../components/ButtonPremium';
import { CardPremium, CardBodyPremium, CardHeaderPremium } from '../components/CardPremium';
import { BadgePremium } from '../components/BadgePremium';
import { Toast } from '../components/Toast';

export const BetaProgramPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    piAddress: '',
    experience: 'beginner',
    motivation: '',
    agreeTerms: false,
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send to backend
      const response = await fetch('/api/beta/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setToastMessage('✅ Application received! Check your email for next steps.');
        setToastVariant('success');
        setFormData({
          name: '',
          email: '',
          piAddress: '',
          experience: 'beginner',
          motivation: '',
          agreeTerms: false,
        });
      } else {
        setToastMessage('❌ Error submitting application. Try again.');
        setToastVariant('error');
      }
    } catch (error) {
      setToastMessage('❌ Network error. Please try again.');
      setToastVariant('error');
    } finally {
      setIsSubmitting(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-12 px-4 overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%)',
            top: '10%',
            left: '10%',
          }}
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Join QRPiPay Beta 🧪
          </h1>
          <p className="text-xl text-cyan-200 mb-6">
            Help shape the future of Pi Network payments
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <BadgePremium variant="secondary" size="lg">
              ⭐ Early Access
            </BadgePremium>
            <BadgePremium variant="secondary" size="lg">
              🎁 Exclusive Rewards
            </BadgePremium>
            <BadgePremium variant="secondary" size="lg">
              🌟 Industry Impact
            </BadgePremium>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left: Why Join */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CardPremium variant="outline">
              <CardHeaderPremium>
                <h2 className="text-xl font-bold text-cyan-300">Why Join?</h2>
              </CardHeaderPremium>
              <CardBodyPremium>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <span className="text-2xl">✨</span>
                    <div>
                      <p className="font-semibold text-cyan-200">Early Access</p>
                      <p className="text-sm text-gray-400">Use QRPiPay before anyone else</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <p className="font-semibold text-cyan-200">Direct Impact</p>
                      <p className="text-sm text-gray-400">Shape the product features</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <p className="font-semibold text-cyan-200">Exclusive Rewards</p>
                      <p className="text-sm text-gray-400">Special recognition & benefits</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-2xl">🚀</span>
                    <div>
                      <p className="font-semibold text-cyan-200">Be Part of Growth</p>
                      <p className="text-sm text-gray-400">Launch a revolutionary product</p>
                    </div>
                  </li>
                </ul>
              </CardBodyPremium>
            </CardPremium>
          </motion.div>

          {/* Center: Application Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <CardPremium variant="glow">
              <CardHeaderPremium>
                <h2 className="text-xl font-bold text-cyan-300">Apply Now 🎯</h2>
              </CardHeaderPremium>
              <CardBodyPremium>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-cyan-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800 border-2 border-slate-700 rounded-lg focus:border-cyan-500 focus:outline-none transition text-white"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-cyan-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800 border-2 border-slate-700 rounded-lg focus:border-cyan-500 focus:outline-none transition text-white"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Pi Address */}
                  <div>
                    <label className="block text-sm font-semibold text-cyan-300 mb-2">
                      Pi Network Username *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.piAddress}
                      onChange={(e) => setFormData({ ...formData, piAddress: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800 border-2 border-slate-700 rounded-lg focus:border-cyan-500 focus:outline-none transition text-white"
                      placeholder="your_pi_username"
                    />
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-sm font-semibold text-cyan-300 mb-2">
                      Technical Experience *
                    </label>
                    <select
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800 border-2 border-slate-700 rounded-lg focus:border-cyan-500 focus:outline-none transition text-white"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  {/* Motivation */}
                  <div>
                    <label className="block text-sm font-semibold text-cyan-300 mb-2">
                      Why do you want to join beta? (Optional)
                    </label>
                    <textarea
                      value={formData.motivation}
                      onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800 border-2 border-slate-700 rounded-lg focus:border-cyan-500 focus:outline-none transition text-white"
                      rows={3}
                      placeholder="Tell us why you're interested..."
                    />
                  </div>

                  {/* Terms */}
                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      required
                      checked={formData.agreeTerms}
                      onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                      className="mt-1"
                    />
                    <label className="text-sm text-cyan-200">
                      I agree to participate in beta testing and provide honest feedback *
                    </label>
                  </div>

                  {/* Submit Button */}
                  <ButtonPremium
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting || !formData.agreeTerms}
                    className="w-full font-bold"
                  >
                    {isSubmitting ? 'Applying...' : 'Apply for Beta 🚀'}
                  </ButtonPremium>
                </form>
              </CardBodyPremium>
            </CardPremium>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <CardPremium variant="outline">
            <CardHeaderPremium>
              <h2 className="text-xl font-bold text-cyan-300">Timeline 📅</h2>
            </CardHeaderPremium>
            <CardBodyPremium>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">Week 1</div>
                  <p className="text-sm text-gray-400 mt-2">Recruitment & Selection</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">Week 2-3</div>
                  <p className="text-sm text-gray-400 mt-2">Beta Testing Period</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">Week 4</div>
                  <p className="text-sm text-gray-400 mt-2">Feedback Analysis</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">Week 5-6</div>
                  <p className="text-sm text-gray-400 mt-2">Public Launch 🚀</p>
                </div>
              </div>
            </CardBodyPremium>
          </CardPremium>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <CardPremium variant="outline">
            <CardHeaderPremium>
              <h2 className="text-xl font-bold text-cyan-300">FAQ ❓</h2>
            </CardHeaderPremium>
            <CardBodyPremium>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-cyan-200">How much time do I need?</p>
                  <p className="text-sm text-gray-400 mt-1">
                    15-20 minutes per session, 5 sessions over 2 weeks (optional)
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-cyan-200">Is there a cost?</p>
                  <p className="text-sm text-gray-400 mt-1">
                    No, beta testing is completely free!
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-cyan-200">What do I get?</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Early access, exclusive rewards, recognition, and lifetime early-adopter benefits
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-cyan-200">How are testers selected?</p>
                  <p className="text-sm text-gray-400 mt-1">
                    We select 15-20 testers to get diverse feedback. All serious applications are considered!
                  </p>
                </div>
              </div>
            </CardBodyPremium>
          </CardPremium>
        </motion.div>
      </div>

      {/* Toast */}
      {showToast && (
        <Toast
          message={toastMessage}
          variant={toastVariant}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default BetaProgramPage;
