/**
 * Database Optimization - Prisma Schema with Indexes
 * Enhanced performance for common queries
 */

// This shows the optimized schema structure
// Run: npx prisma migrate dev --name add_performance_indexes

/*
Key optimizations:

1. Indexes on frequently queried fields:
   - userId (payments, qrcodes, transactions)
   - status (payments, transactions)
   - createdAt (for date range queries)
   - piAddress (user lookup)

2. Composite indexes for common filters:
   - (userId, status) for filtered payment queries
   - (userId, createdAt) for date range queries

3. Foreign key indexes:
   - Automatic for relationships

4. Full-text search ready:
   - username, email searchable

Migration SQL:
*/

-- Add indexes for performance
CREATE INDEX idx_payments_userId ON payments(userId);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_createdAt ON payments("createdAt");
CREATE INDEX idx_payments_userId_status ON payments(userId, status);
CREATE INDEX idx_payments_userId_createdAt ON payments(userId, "createdAt");

CREATE INDEX idx_qrcodes_userId ON qrcodes(userId);
CREATE INDEX idx_qrcodes_createdAt ON qrcodes("createdAt");

CREATE INDEX idx_transactions_userId ON transactions(userId);
CREATE INDEX idx_transactions_paymentId ON transactions(paymentId);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_userId_status ON transactions(userId, status);

CREATE INDEX idx_users_piAddress ON users(piAddress);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Analyze tables for query optimization
ANALYZE payments;
ANALYZE qrcodes;
ANALYZE transactions;
ANALYZE users;
