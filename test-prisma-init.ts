import { prisma } from './lib/db/prisma';

async function main() {
  try {
    console.log('Prisma client initialized successfully');
    await prisma.$disconnect();
    console.log('Disconnected');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();

