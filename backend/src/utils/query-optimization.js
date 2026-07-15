/**
 * Prisma Query Optimization Patterns
 * Best practices for performance
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

// ==========================================
// OPTIMIZATION PATTERNS
// ==========================================

/**
 * Pattern 1: Select only needed fields
 * ❌ SLOW: Fetches all columns
 * ✅ FAST: Fetches only needed fields
 */
async function getPaymentsOptimized(userId) {
  // ❌ Slow - fetches all fields
  // const payments = await prisma.payment.findMany({
  //   where: { userId }
  // });

  // ✅ Fast - select only needed fields
  const payments = await prisma.payment.findMany({
    where: { userId },
    select: {
      id: true,
      amount: true,
      status: true,
      createdAt: true,
      txid: true
    }
  });

  return payments;
}

/**
 * Pattern 2: Use pagination
 * ❌ SLOW: Fetch 10,000 records
 * ✅ FAST: Fetch 20 at a time
 */
async function getPaymentsPaginated(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where: { userId },
      select: {
        id: true,
        amount: true,
        status: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.payment.count({ where: { userId } })
  ]);

  return {
    payments,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page
  };
}

/**
 * Pattern 3: Batch queries with Promise.all
 * ❌ SLOW: Sequential queries (N+1 problem)
 * ✅ FAST: Parallel queries
 */
async function getDashboardStatsSlow(userId) {
  // ❌ Slow - sequential queries
  // const payments = await prisma.payment.findMany({ where: { userId } });
  // const qrcodes = await prisma.qrCode.findMany({ where: { userId } });
  // const transactions = await prisma.transaction.findMany({ where: { userId } });

  // ✅ Fast - parallel queries
  const [payments, qrcodes, transactions] = await Promise.all([
    prisma.payment.findMany({ where: { userId } }),
    prisma.qrCode.findMany({ where: { userId } }),
    prisma.transaction.findMany({ where: { userId } })
  ]);

  return {
    totalPayments: payments.length,
    totalQRCodes: qrcodes.length,
    totalTransactions: transactions.length
  };
}

/**
 * Pattern 4: Aggregate queries
 * ❌ SLOW: Fetch and calculate in app
 * ✅ FAST: Calculate in database
 */
async function getPaymentStatisticsSlow(userId) {
  // ❌ Slow - fetch all and calculate
  // const payments = await prisma.payment.findMany({ where: { userId } });
  // const total = payments.reduce((sum, p) => sum + p.amount, 0);

  // ✅ Fast - aggregate in database
  const stats = await prisma.payment.aggregate({
    where: { userId },
    _sum: { amount: true },
    _count: true,
    _avg: { amount: true },
    _min: { amount: true },
    _max: { amount: true }
  });

  return {
    totalAmount: stats._sum.amount || 0,
    count: stats._count,
    average: stats._avg.amount || 0,
    min: stats._min.amount || 0,
    max: stats._max.amount || 0
  };
}

/**
 * Pattern 5: Group and aggregate
 * ✅ FAST: Group by date for trends
 */
async function getPaymentTrendsByDate(userId, days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const trends = await prisma.payment.groupBy({
    by: ['status'],
    where: {
      userId,
      createdAt: { gte: startDate }
    },
    _sum: { amount: true },
    _count: true,
    orderBy: { _count: { id: 'desc' } }
  });

  return trends.map(trend => ({
    status: trend.status,
    count: trend._count,
    totalAmount: trend._sum.amount || 0
  }));
}

/**
 * Pattern 6: Use include sparingly
 * ❌ SLOW: Include all relations
 * ✅ FAST: Include only needed relations
 */
async function getPaymentWithUserOptimized(paymentId) {
  // ✅ Include only needed relation
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    }
  });

  return payment;
}

/**
 * Pattern 7: Connection pooling
 * ✅ FAST: Reuse connections
 */
const prismaOptimized = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

/**
 * Pattern 8: Use raw queries for complex operations
 * ✅ FAST: When ORM is slower
 */
async function getComplexAnalytics(userId) {
  const results = await prisma.$queryRaw`
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as count,
      SUM(amount) as total,
      COUNT(*) FILTER (WHERE status = 'completed') as completed
    FROM payments
    WHERE user_id = ${userId}
    GROUP BY DATE(created_at)
    ORDER BY date DESC
    LIMIT 30
  `;

  return results;
}

/**
 * Pattern 9: Caching frequent queries
 * ✅ FAST: Cache expensive queries
 */
const queryCache = new Map();

async function getUserWithCache(userId) {
  const cacheKey = `user_${userId}`;

  // Check cache
  if (queryCache.has(cacheKey)) {
    return queryCache.get(cacheKey);
  }

  // Query database
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  // Cache result (5 minutes)
  queryCache.set(cacheKey, user);
  setTimeout(() => queryCache.delete(cacheKey), 5 * 60 * 1000);

  return user;
}

/**
 * Pattern 10: Transaction for multiple operations
 * ✅ FAST: Atomic operations, no race conditions
 */
async function transferPaymentsSafe(fromUserId, toUserId, amount) {
  return await prisma.$transaction(async (tx) => {
    // Deduct from source
    const from = await tx.user.update({
      where: { id: fromUserId },
      data: { balance: { decrement: amount } }
    });

    // Add to destination
    const to = await tx.user.update({
      where: { id: toUserId },
      data: { balance: { increment: amount } }
    });

    return { from, to };
  });
}

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  getPaymentsOptimized,
  getPaymentsPaginated,
  getDashboardStatsSlow,
  getPaymentStatisticsSlow,
  getPaymentTrendsByDate,
  getPaymentWithUserOptimized,
  getComplexAnalytics,
  getUserWithCache,
  transferPaymentsSafe
};
