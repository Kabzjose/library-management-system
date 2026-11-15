import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

let isbnCounter = 0;
const nextIsbn = () => `978${String(++isbnCounter).padStart(10, '0')}`; // placeholder ISBNs

// 1. Explicitly type your objects or use 'as const' to tighten the literal types
const genres = [
  { name: 'Fantasy', description: 'Magic, myth and imagined worlds.' },
  { name: 'Science Fiction', description: 'Speculative futures and technology.' },
  { name: 'Mystery', description: 'Crime, detection and suspense.' },
  { name: 'Non-Fiction', description: 'Science, history and true stories.' },
] as const; // <-- adding 'as const' makes the name strings specific literals

interface SeedBook {
  title: string;
  author: string;
  publishedYear: number;
  isbn: string;
  description: string;
}

// 2. Explicitly type the books object record with a strict string index signature
const books: Record<string, SeedBook[]> = {
  Fantasy: [
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', publishedYear: 1937, isbn: '9780261102217', description: 'Bilbo Baggins joins a quest to reclaim a dwarf kingdom.' },
    { title: 'A Wizard of Earthsea', author: 'Ursula K. Le Guin', publishedYear: 1968, isbn: '9780547773742', description: 'A young mage confronts the shadow he unleashed.' },
    { title: 'The Name of the Wind', author: 'Patrick Rothfuss', publishedYear: 2007, isbn: '9780756404741', description: 'The legendary Kvothe tells his own story.' },
    { title: 'Mistborn: The Final Empire', author: 'Brandon Sanderson', publishedYear: 2006, isbn: '9780765311788', description: 'A crew of thieves plots to topple an immortal ruler.' },
  ],
  'Science Fiction': [
    { title: 'Dune', author: 'Frank Herbert', publishedYear: 1965, isbn: '9780441172719', description: 'Politics and prophecy on the desert planet Arrakis.' },
    { title: 'Neuromancer', author: 'William Gibson', publishedYear: 1984, isbn: '9780441569595', description: 'A washed-up hacker takes one last job in cyberspace.' },
    { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', publishedYear: 1969, isbn: '9780441478125', description: 'An envoy visits a world without fixed gender.' },
    { title: 'Project Hail Mary', author: 'Andy Weir', publishedYear: 2021, isbn: '9780593135204', description: 'A lone astronaut must save Earth from extinction.' },
  ],
  Mystery: [
    { title: 'And Then There Were None', author: 'Agatha Christie', publishedYear: 1939, isbn: '9780007136834', description: 'Ten strangers are lured to an island and picked off.' },
    { title: 'The Hound of the Baskervilles', author: 'Arthur Conan Doyle', publishedYear: 1902, isbn: '9780140437805', description: 'Sherlock Holmes investigates a spectral hound.' },
    { title: 'Gone Girl', author: 'Gillian Flynn', publishedYear: 2012, isbn: '9780307588371', description: 'A wife vanishes and her husband becomes the suspect.' },
    { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', publishedYear: 2005, isbn: '9780307269751', description: 'A journalist and a hacker probe a decades-old disappearance.' },
  ],
  'Non-Fiction': [
    { title: 'Sapiens', author: 'Yuval Noah Harari', publishedYear: 2011, isbn: '9780062316097', description: 'A sweeping history of humankind.' },
    { title: 'Educated', author: 'Tara Westover', publishedYear: 2018, isbn: '9780399590504', description: 'A memoir of growing up off-grid and finding education.' },
    { title: 'Cosmos', author: 'Carl Sagan', publishedYear: 1980, isbn: '9780345331359', description: 'A tour of the universe and our place in it.' },
    { title: 'Silent Spring', author: 'Rachel Carson', publishedYear: 1962, isbn: '9780618249060', description: 'The book that launched the modern environmental movement.' },
  ],
};

async function main() {
  await prisma.review.deleteMany();
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('Password123!', 10);

  await prisma.user.createMany({
    data: [
      { email: 'librarian@example.com', name: 'Lena Librarian', role: Role.LIBRARIAN, password },
      { email: 'patron@example.com', name: 'Pat Patron', role: Role.PATRON, password },
    ],
  });

  for (const genre of genres) {
    await prisma.genre.create({
      data: {
        name: genre.name,
        description: genre.description,
        books: {
          // Explicitly typing parameter 'b' to clean error 7006
          create: books[genre.name].map((b: SeedBook) => ({
            ...b,
            totalCopies: 3,
          })),
        },
      },
    });
  }

  const [genreCount, bookCount] = await Promise.all([prisma.genre.count(), prisma.book.count()]);
  console.log(`Seeded ${genreCount} genres and ${bookCount} books.`);
}
