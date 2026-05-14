/**
 * 👤 User Routes
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';

const router = Router();

// Validation schemas
const CreateUserSchema = z.object({
  piUid: z.string(),
  username: z.string(),
  email: z.string().email().optional(),
  businessName: z.string().optional(),
  businessCategory: z.string().optional(),
});

/**
 * POST /api/users
 * Create new user
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = CreateUserSchema.parse(req.body);

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { piUid: data.piUid },
    });

    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        piUid: data.piUid,
        username: data.username,
        email: data.email,
        businessName: data.businessName,
        businessCategory: data.businessCategory,
        isKycVerified: false,
      },
    });

    console.log('[API] User created:', user.username);

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error: unknown) {
    console.error('[API] User creation error:', error);
    const details = error instanceof z.ZodError ? error.errors : undefined;
    res.status(400).json({
      error: 'Invalid user data',
      details,
    });
  }
});

/**
 * GET /api/users/:piUid
 * Get user profile
 */
router.get('/:piUid', async (req: Request, res: Response) => {
  try {
    const { piUid } = req.params;

    const user = await prisma.user.findUnique({
      where: { piUid },
      include: {
        _count: {
          select: {
            payments: true,
            qrCodes: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('[API] Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

/**
 * PUT /api/users/:piUid
 * Update user profile
 */
router.put('/:piUid', async (req: Request, res: Response) => {
  try {
    const { piUid } = req.params;
    const data = req.body;

    const user = await prisma.user.update({
      where: { piUid },
      data: {
        businessName: data.businessName,
        businessCategory: data.businessCategory,
        description: data.description,
        website: data.website,
        theme: data.theme,
        notificationsEnabled: data.notificationsEnabled,
      },
    });

    console.log('[API] User updated:', piUid);

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('[API] Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

/**
 * POST /api/users/:piUid/kyc/verify
 * Mark user as KYC verified
 */
router.post('/:piUid/kyc/verify', async (req: Request, res: Response) => {
  try {
    const { piUid } = req.params;

    const user = await prisma.user.update({
      where: { piUid },
      data: {
        isKycVerified: true,
        kycVerifiedAt: new Date(),
      },
    });

    console.log('[API] User KYC verified:', piUid);

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('[API] KYC verify error:', error);
    res.status(500).json({ error: 'Failed to verify KYC' });
  }
});

export default router;
