import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Crée un utilisateur de test
  const user = await prisma.user.create({
    data: {
      piAddress: 'pi_test_user_123',
      username: 'testuser',
      email: 'test@example.com',
      verified: true,
    },
  });

  console.log('✅ Created user:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
