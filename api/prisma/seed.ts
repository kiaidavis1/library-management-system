import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const genres = [
  { name: 'Fiction', slug: 'fiction' },
  { name: 'Science Fiction', slug: 'science-fiction' },
  { name: 'History', slug: 'history' },
  { name: 'Technology', slug: 'technology' },
];

const books = [
  // Fiction
  { title: 'Things Fall Apart', author: 'Chinua Achebe', isbn: '9780385474542', copies: 3, genre: 'fiction' },
  { title: 'Weep Not, Child', author: 'Ngugi wa Thiongo', isbn: '9780435908300', copies: 2, genre: 'fiction' },
  { title: 'Half of a Yellow Sun', author: 'Chimamanda Ngozi Adichie', isbn: '9781400095209', copies: 2, genre: 'fiction' },
  { title: 'The Alchemist', author: 'Paulo Coelho', isbn: '9780061122415', copies: 4, genre: 'fiction' },
  // Science Fiction
  { title: 'Dune', author: 'Frank Herbert', isbn: '9780441172719', copies: 3, genre: 'science-fiction' },
  { title: 'Neuromancer', author: 'William Gibson', isbn: '9780441569595', copies: 2, genre: 'science-fiction' },
  { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', isbn: '9780441478125', copies: 2, genre: 'science-fiction' },
  { title: 'Foundation', author: 'Isaac Asimov', isbn: '9780553293357', copies: 3, genre: 'science-fiction' },
  // History
  { title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '9780062316110', copies: 5, genre: 'history' },
  { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', isbn: '9780393317558', copies: 2, genre: 'history' },
  { title: 'A Peoples History of the United States', author: 'Howard Zinn', isbn: '9780062397348', copies: 2, genre: 'history' },
  { title: 'The Shortest History of Europe', author: 'John Hirst', isbn: '9781615192861', copies: 1, genre: 'history' },
  // Technology
  { title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', copies: 3, genre: 'technology' },
  { title: 'The Pragmatic Programmer', author: 'Andrew Hunt and David Thomas', isbn: '9780135957059', copies: 2, genre: 'technology' },
  { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', isbn: '9781449373320', copies: 2, genre: 'technology' },
  { title: 'You Dont Know JS Yet', author: 'Kyle Simpson', isbn: '9781091210099', copies: 2, genre: 'technology' },
];

async function main() {
  const genreIds: Record<string, number> = {};

  for (const genre of genres) {
    const saved = await prisma.genre.upsert({
      where: { slug: genre.slug },
      update: {},
      create: genre,
    });
    genreIds[genre.slug] = saved.id;
  }

  for (const book of books) {
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {},
      create: {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        totalCopies: book.copies,
        availableCopies: book.copies,
        genreId: genreIds[book.genre],
      },
    });
  }

  console.log(`Seeded ${genres.length} genres and ${books.length} books`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });