import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const genres = [
    { name: 'Fiction', slug: 'fiction' },
    { name: 'Science Fiction', slug: 'science-fiction' },
    { name: 'History', slug: 'history' },
    { name: 'Technology', slug: 'technology' },
  ];

  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { slug: genre.slug },
      update: {},
      create: genre,
    });
  }

  console.log(`Seeded ${genres.length} genres`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });