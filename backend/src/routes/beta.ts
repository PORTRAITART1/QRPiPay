/**
 * Beta Program API Routes
 * Handle beta applications and management
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const router = Router();
const prisma = new PrismaClient();

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * POST /api/beta/apply
 * Submit beta application
 */
router.post('/apply', async (req: Request, res: Response) => {
  try {
    const { name, email, piAddress, experience, motivation, agreeTerms } = req.body;

    // Validation
    if (!name || !email || !piAddress || !agreeTerms) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if already applied
    const existing = await prisma.betaApplication.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(400).json({ error: 'You have already applied' });
    }

    // Create application
    const application = await prisma.betaApplication.create({
      data: {
        name,
        email,
        piAddress,
        experience,
        motivation,
        agreeTerms,
        status: 'PENDING',
        appliedAt: new Date(),
      },
    });

    // Send confirmation email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🧪 QRPiPay Beta Application Received',
      html: `
        <h1>Welcome to QRPiPay Beta! 🎉</h1>
        <p>Hi ${name},</p>
        <p>Thank you for applying to the QRPiPay beta program!</p>
        
        <h2>What's Next?</h2>
        <ul>
          <li>We'll review your application (2-3 days)</li>
          <li>Selected testers will receive an email with onboarding instructions</li>
          <li>You'll get exclusive early access to QRPiPay v2.0</li>
        </ul>
        
        <h2>In the Meantime</h2>
        <p>Join our community:</p>
        <ul>
          <li>Discord: [link]</li>
          <li>Twitter: @QRPiPay</li>
          <li>Email: beta@qrpipay.com</li>
        </ul>
        
        <p>Thanks for your interest!</p>
        <p>QRPiPay Team 🚀</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: 'Application received. Check your email!',
      applicationId: application.id,
    });
  } catch (error) {
    console.error('Beta application error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/beta/applications
 * Get all applications (admin only)
 */
router.get('/applications', async (req: Request, res: Response) => {
  try {
    // Check authorization
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const applications = await prisma.betaApplication.findMany({
      orderBy: { appliedAt: 'desc' },
    });

    res.json(applications);
  } catch (error) {
    console.error('Fetch applications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * PATCH /api/beta/applications/:id/status
 * Update application status (admin only)
 */
router.patch('/applications/:id/status', async (req: Request, res: Response) => {
  try {
    // Check authorization
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const application = await prisma.betaApplication.update({
      where: { id },
      data: { status },
    });

    // Send notification email
    let emailSubject = '';
    let emailHtml = '';

    if (status === 'APPROVED') {
      emailSubject = '🎉 Welcome to QRPiPay Beta!';
      emailHtml = `
        <h1>You're In! 🎉</h1>
        <p>Hi ${application.name},</p>
        <p>Congratulations! You've been selected for the QRPiPay beta program!</p>
        
        <h2>Getting Started</h2>
        <ol>
          <li><a href="https://qrpipay-frontend.onrender.com">Login to QRPiPay</a></li>
          <li>Complete your profile</li>
          <li>Start testing features</li>
          <li>Share feedback via the form</li>
        </ol>
        
        <h2>Your Mission (Optional)</h2>
        <ul>
          <li>Test 5 features over 2 weeks</li>
          <li>Report bugs you find</li>
          <li>Share design feedback</li>
          <li>Suggest improvements</li>
        </ul>
        
        <h2>Rewards</h2>
        <ul>
          <li>Early access to premium features</li>
          <li>Lifetime early-adopter benefits</li>
          <li>Special recognition</li>
          <li>Your name in launch credits</li>
        </ul>
        
        <p>Questions? Reply to this email!</p>
        <p>QRPiPay Team 🚀</p>
      `;
    } else if (status === 'REJECTED') {
      emailSubject = '📝 QRPiPay Beta Application Update';
      emailHtml = `
        <h1>Application Update</h1>
        <p>Hi ${application.name},</p>
        <p>Thank you for applying to the QRPiPay beta program.</p>
        <p>We received many applications and could only select 15-20 testers. Unfortunately, 
           you were not selected this time.</p>
        
        <p>But don't worry! You can:</p>
        <ul>
          <li>Try QRPiPay when it launches publicly (soon!)</li>
          <li>Apply for future beta programs</li>
          <li>Join our community for updates</li>
        </ul>
        
        <p>Thanks for your interest! 🙏</p>
        <p>QRPiPay Team</p>
      `;
    }

    if (emailHtml) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: application.email,
        subject: emailSubject,
        html: emailHtml,
      });
    }

    res.json({ success: true, application });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/beta/stats
 * Get beta program statistics
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const total = await prisma.betaApplication.count();
    const approved = await prisma.betaApplication.count({
      where: { status: 'APPROVED' },
    });
    const pending = await prisma.betaApplication.count({
      where: { status: 'PENDING' },
    });
    const rejected = await prisma.betaApplication.count({
      where: { status: 'REJECTED' },
    });
    const active = await prisma.betaApplication.count({
      where: { status: 'ACTIVE' },
    });

    res.json({
      total,
      approved,
      pending,
      rejected,
      active,
      availableSlots: Math.max(0, 20 - approved),
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
