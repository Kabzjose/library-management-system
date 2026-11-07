## Schema Decisions

### Why Book references Genre instead of embedding it

In a relational database, `Book` stores a `genreId` foreign key pointing at a
single row in the `Genre` table, rather than copying genre data into each book.

- **Single source of truth.** A genre's name and description live in one row.
  Renaming "Sci-Fi" to "Science Fiction" is one update, not a rewrite of every
  book that belongs to it.
- **Consistency.** The foreign key constraint means a book can never point to a
  genre that doesn't exist, and `Genre.name` is unique, so there are no
  duplicates like "Mystery" and "mystery".
- **Efficient queries.** Listing all books in a genre, or counting books per
  genre, is an indexed join on `genreId`, not a scan through embedded copies.
- **Genre is shared, independent data.** Many books belong to one genre, and
  genres exist on their own (they can be listed or edited without any books).
  Data with its own lifecycle that is shared by many records should be
  referenced, not embedded.

### Other decisions

- `Role` is an enum (`PATRON`, `LIBRARIAN`) on `User`, defaulting to `PATRON`,
  so invalid roles are rejected by the database.
- `Review` (stretch) links `Book` and `User`, with `@@unique([bookId, userId])`
  so a user can review a book only once. Reviews cascade-delete with their
  book or user.
- Secrets live in `.env` (git-ignored); `.env.example` holds only a placeholder.

### Prisma vs. a document database

Modeling in Prisma felt different mainly because I had to decide relationships
up front. In a document database like MongoDB I might have embedded the genre
(or even reviews) inside each book document and moved on. In Prisma, the
schema forced me to separate the entities, declare foreign keys, and think
about integrity and delete behaviour (e.g. cascade on reviews). It's more
upfront work, but the database enforces the rules instead of my application
code.

## Setup

1. `cd api && npm install`
2. `cp .env.example .env` and set `DATABASE_URL` to your hosted PostgreSQL URL
3. `npx prisma migrate dev --name init` (use `npx prisma migrate deploy` against production)
4. `npx prisma db seed`