const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const types = ['Main Diet', 'Vegan', 'Dessert', 'Water'];
  for (const type of types) {
    await prisma.typeBook.upsert({
      where: { name: type },
      update: {},
      create: { name: type },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });