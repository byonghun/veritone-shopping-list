import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.item.count();

  if (count > 0) return;

  await prisma.item.createMany({
    data: [
      { itemName: "Apples", description: "Honey Crisp", quantity: 4 },
      { itemName: "Eggs", description: "Free-range", quantity: 2 },
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
