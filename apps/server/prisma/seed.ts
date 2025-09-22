import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.item.count();

  if (count > 0) return;

  await prisma.item.createMany({
    data: [
      { name: "Apples", description: "Honey Crisp", quantity: 8 },
      { name: "Eggs", description: "Free-range", quantity: 20 },
    ],
  });
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });