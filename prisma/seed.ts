import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Récupérer l'email et le mot de passe admin depuis les variables d'environnement
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error('❌ ADMIN_EMAIL ou ADMIN_PASSWORD non défini');
    process.exit(1);
  }

  // Vérifier si l'admin existe déjà
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`✅ Admin user already exists: ${adminEmail}`);
    return;
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  // Créer l'utilisateur admin
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      hashedPassword: hashedPassword,
      role: 'admin',
    },
  });

  console.log(`✅ Admin user created successfully: ${admin.email}`);
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log('⚠️  IMPORTANT: Changez le mot de passe après la première connexion!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
