/**
 * 📧 Beta Notifications Service
 * Send emails to beta testers with important updates
 */

import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export interface BetaNotification {
  subject: string;
  html: string;
  recipients: 'APPROVED' | 'ACTIVE' | 'ALL';
}

/**
 * Send notification to beta testers
 */
export async function sendBetaNotification(notification: BetaNotification) {
  try {
    // Get recipients based on status
    let recipients;

    if (notification.recipients === 'ALL') {
      recipients = await prisma.betaApplication.findMany({
        where: {
          status: {
            in: ['APPROVED', 'ACTIVE'],
          },
        },
      });
    } else {
      recipients = await prisma.betaApplication.findMany({
        where: {
          status: notification.recipients,
        },
      });
    }

    console.log(`📧 Sending "${notification.subject}" to ${recipients.length} testers...`);

    // Send emails
    const results = await Promise.allSettled(
      recipients.map((tester) =>
        transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: tester.email,
          subject: notification.subject,
          html: notification.html,
        })
      )
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    console.log(`✅ Successfully sent: ${successful}`);
    console.log(`❌ Failed: ${failed}`);

    return { successful, failed, total: recipients.length };
  } catch (error) {
    console.error('Notification error:', error);
    throw error;
  }
}

/**
 * Send testing session reminders
 */
export async function sendSessionReminders() {
  const notification: BetaNotification = {
    subject: '🧪 QRPiPay Beta - Testing Session Ready! 🚀',
    recipients: 'ACTIVE',
    html: `
      <h1>Ready for Your Next Testing Session? 🧪</h1>
      <p>Hi beta tester!</p>
      
      <p>Your next QRPiPay testing session is ready!</p>
      
      <h2>Today's Tasks (15 min)</h2>
      <ul>
        <li>✅ Try generating a QR code</li>
        <li>📊 Check the analytics dashboard</li>
        <li>💬 Share your feedback in the form</li>
      </ul>
      
      <h2>Quick Links</h2>
      <ul>
        <li><a href="https://qrpipay-frontend.onrender.com/dashboard">Dashboard</a></li>
        <li><a href="https://qrpipay-frontend.onrender.com/qr-generator">QR Generator</a></li>
        <li><a href="https://forms.google.com/beta-feedback">Feedback Form</a></li>
      </ul>
      
      <p>Thank you for being part of QRPiPay! 🙏</p>
      <p>QRPiPay Team</p>
    `,
  };

  return sendBetaNotification(notification);
}

/**
 * Send thank you message after testing period
 */
export async function sendThankYouMessage() {
  const notification: BetaNotification = {
    subject: '🎉 Thank You for Testing QRPiPay! 🎊',
    recipients: 'ACTIVE',
    html: `
      <h1>Thank You, Beta Tester! 🎉</h1>
      <p>Hi there!</p>
      
      <p>Your beta testing period with QRPiPay is complete, and we want to thank you!</p>
      
      <h2>Your Impact</h2>
      <p>Your feedback helped us:</p>
      <ul>
        <li>✅ Fix critical bugs</li>
        <li>✅ Improve user experience</li>
        <li>✅ Create a better product</li>
        <li>✅ Plan awesome new features</li>
      </ul>
      
      <h2>Your Rewards</h2>
      <ul>
        <li>🌟 Lifetime early-adopter status</li>
        <li>🎁 Exclusive beta tester badge</li>
        <li>📜 Recognition in launch announcement</li>
        <li>🚀 Priority access to new features</li>
      </ul>
      
      <h2>What's Next?</h2>
      <p>QRPiPay is launching publicly in 2 weeks!</p>
      <p>Stay tuned for:</p>
      <ul>
        <li>🎊 Public launch announcement</li>
        <li>🎁 Launch day bonuses</li>
        <li>🌍 Community celebration</li>
      </ul>
      
      <p>Thank you for your incredible support! 🙏</p>
      <p>QRPiPay Team 🚀</p>
    `,
  };

  return sendBetaNotification(notification);
}

/**
 * Send feature update notification
 */
export async function sendFeatureUpdateNotification(feature: string, details: string) {
  const notification: BetaNotification = {
    subject: `✨ New Feature Available: ${feature}`,
    recipients: 'ALL',
    html: `
      <h1>✨ New Feature Update</h1>
      <p>Hi beta tester!</p>
      
      <p>We've deployed a new feature based on your feedback!</p>
      
      <h2>${feature}</h2>
      <p>${details}</p>
      
      <p><a href="https://qrpipay-frontend.onrender.com/dashboard">Try it now!</a></p>
      
      <p>Let us know what you think! 💭</p>
      
      <p>QRPiPay Team</p>
    `,
  };

  return sendBetaNotification(notification);
}

/**
 * Send bug fix notification
 */
export async function sendBugFixNotification(bugTitle: string, details: string) {
  const notification: BetaNotification = {
    subject: `🔧 Bug Fix Deployed: ${bugTitle}`,
    recipients: 'ALL',
    html: `
      <h1>🔧 Bug Fix</h1>
      <p>Hi beta tester!</p>
      
      <p>We fixed the issue you reported!</p>
      
      <h2>${bugTitle}</h2>
      <p>${details}</p>
      
      <p>Please test and confirm it's working. Thank you! 🙏</p>
      
      <p>QRPiPay Team</p>
    `,
  };

  return sendBetaNotification(notification);
}

export default {
  sendBetaNotification,
  sendSessionReminders,
  sendThankYouMessage,
  sendFeatureUpdateNotification,
  sendBugFixNotification,
};
