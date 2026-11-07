import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

const genres = [
  { name: 'Fantasy', description: 'Magic, myth and imagined worlds.' },
  { name: 'Science Fiction', description: 'Speculative futures and technology.' },
  { name: 'Mystery', description: 'Crime, detection and suspense.' },
  { name: 'Non-Fiction', description: 'Science, history and true stories.' },
];

const books: Record<string, { title: string; author: string; publishedYear: number; description: string }[]> = {
  Fantasy: [
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', publishedYear: 1937, description: 'Bilbo Baggins joins a quest to reclaim a dwarf kingdom.' },
    { title: 'A Wizard of Earthsea', author: 'Ursula K. Le Guin', publishedYear: 1968, description: 'A young mage confronts the shadow he unleashed.' },
    { title: 'The Name of the Wind', author: 'Patrick Rothfuss', publishedYear: 2007, description: 'The legendary Kvothe tells his own story.' },
    { title: 'Mistborn: The Final Empire', author: 'Brandon Sanderson', publishedYear: 2006, description: 'A crew of thieves plots to topple an immortal ruler.' },
  ],
  'Science Fiction': [
    { title: 'Dune', author: 'Frank Herbert', publishedYear: 1965, description: 'Politics and prophecy on the desert planet Arrakis.' },
    { title: 'Neuromancer', author: 'William Gibson', publishedYear: 1984, description: 'A washed-up hacker takes one last job in cyberspace.' },
    { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', publishedYear: 1969, description: 'An envoy visits a world without fixed gender.' },
    { title: 'Project Hail Mary', author: 'Andy Weir', publishedYear: 2021, description: 'A lone astronaut must save Earth from extinction.' },
  ],
  Mystery: [
    { title: 'And Then There Were None', author: 'Agatha Christie', publishedYear: 1939, description: 'Ten strangers are lured to an island and picked off.' },
    { title: 'The Hound of the Baskervilles', author: 'Arthur Conan Doyle', publishedYear: 1902, description: 'Sherlock Holmes investigates a spectral hound.' },
    { title: 'Gone Girl', author: 'Gillian Flynn', publishedYear: 2012, description: 'A wife vanishes and her husband becomes the suspect.' },
    { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', publishedYear: 2005, description: 'A journalist and a hacker probe a decades-old disappearance.' },
  ],
  'Non-Fiction': [
    { title: 'Sapiens', author: 'Yuval Noah Harari', publishedYear: 2011, description: 'A sweeping history of humankind.' },
    { title: 'Educated', author: 'Tara Westover', publishedYear: 2018, description: 'A memoir of growing up off-grid and finding education.' },
    { title: 'Cosmos', author: 'Carl Sagan', publishedYear: 1980, description: 'A tour of the universe and our place in it.' },
    { title: 'Silent Spring', author: 'Rachel Carson', publishedYear: 1962, description: 'The book that launched the modern environmental movement.' },
  ],
};

async function main() {
  // Clear in dependency order so the seed can be re-run safely
  await prisma.review.deleteMany();
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      { email: 'librarian@example.com', name: 'Lena Librarian', role: Role.LIBRARIAN },
      { email: 'patron@example.com', name: 'Pat Patron', role: Role.PATRON },
    ],
  });

  for (const genre of genres) {
    await prisma.genre.create({
      data: {
        ...genre,
        books: {
          create: books[genre.name].map((b) => ({ ...b, copiesAvailable: 3 })),
        },
      },
    });
  }

  const [genreCount, bookCount] = await Promise.all([
    prisma.genre.count(),
    prisma.book.count(),
  ]);
  console.log(`Seeded ${genreCount} genres and ${bookCount} books.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());