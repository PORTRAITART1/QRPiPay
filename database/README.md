# Database Configuration - QRPiPay

## PostgreSQL Setup

### Docker (Recommended for development)

```bash
docker run --name qrpipay-db \
  -e POSTGRES_USER=qrpipay \
  -e POSTGRES_PASSWORD=dev_password \
  -e POSTGRES_DB=qrpipay \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### Manual Setup

1. Install PostgreSQL 15+
2. Create database:
```sql
CREATE DATABASE qrpipay;
CREATE USER qrpipay WITH PASSWORD 'dev_password';
GRANT ALL PRIVILEGES ON DATABASE qrpipay TO qrpipay;
```

## Prisma Setup

### Environment Variables

Create `.env` in database folder:

```
DATABASE_URL="postgresql://qrpipay:dev_password@localhost:5432/qrpipay"
```

### Initial Migration

```bash
cd database
npm install

# Generate Prisma Client
npm run generate

# Create migration
npm run migrate

# View database
npm run studio
```

## Schema Overview

- **Users** - Merchants/commerçants
- **QRCodes** - Generated payment QR codes
- **Payments** - Payment transactions
- **Analytics** - Daily metrics

## Seed Data (Optional)

```bash
npm run seed
```

## Development

```bash
# Watch for schema changes
npx prisma generate --watch

# View data in UI
npm run studio
```

## Production

```bash
npm run migrate:prod
```
