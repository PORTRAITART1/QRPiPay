import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test user
  const user = await prisma.user.create({
    data: {
      piUid: 'pi_user_test_001',
      username: 'test_merchant',
      email: 'merchant@example.com',
      businessName: 'Test Cafe',
      businessCategory: 'Restaurant',
      isKycVerified: true,
      kycVerifiedAt: new Date(),
    },
  });

  console.log('✅ Test user created:', user.username);

  // Create test QR codes
  const qr1 = await prisma.qRCode.create({
    data: {
      userId: user.id,
      amount: new Decimal('10.50'),
      description: 'Café Latte + Croissant',
      qrData: JSON.stringify({
        amount: 10.5,
        memo: 'Café Latte + Croissant',
        userId: user.piUid,
      }),
      status: 'PENDING',
    },
  });

  const qr2 = await prisma.qRCode.create({
    data: {
      userId: user.id,
      amount: new Decimal('25.00'),
      description: 'Pizza Margherita',
      qrData: JSON.stringify({
        amount: 25,
        memo: 'Pizza Margherita',
        userId: user.piUid,
      }),
      status: 'COMPLETED',
    },
  });

  console.log('✅ Test QR codes created');

  // Create test payments
  const payment1 = await prisma.payment.create({
    data: {
      userId: user.id,
      qrCodeId: qr2.id,
      piPaymentId: 'pi_payment_001_test',
      amount: new Decimal('25.00'),
      memo: 'Pizza Margherita',
      status: 'COMPLETED',
      buyerPiUid: 'pi_user_buyer_001',
      buyerUsername: 'buyer_username',
      txid: 'txid_blockchain_001',
      approvedAt: new Date(),
      completedAt: new Date(),
    },
  });

  const payment2 = await prisma.payment.create({
    data: {
      userId: user.id,
      qrCodeId: qr1.id,
      piPaymentId: 'pi_payment_002_test',
      amount: new Decimal('10.50'),
      memo: 'Café Latte + Croissant',
      status: 'COMPLETED',
      buyerPiUid: 'pi_user_buyer_002',
      buyerUsername: 'buyer_username_2',
      txid: 'txid_blockchain_002',
      approvedAt: new Date(),
      completedAt: new Date(),
    },
  });

  console.log('✅ Test payments created');

  // Create test analytics
  const analytics = await prisma.analytics.create({
    data: {
      userId: user.id,
      date: new Date(),
      totalPayments: 2,
      totalAmount: new Decimal('35.50'),
      uniqueCustomers: 2,
      qrCodesGenerated: 2,
      qrCodesScanned: 2,
      successRate: 100,
    },
  });

  console.log('✅ Analytics created');

  console.log('🌱 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
