# Library Management System

A library catalog API built with NestJS, Prisma and PostgreSQL.
This week covers the data layer: schema, migration and seed data.

## Setup

1. Install dependencies: `cd api && npm install`
2. Copy `api/.env.example` to `api/.env` and set `DATABASE_URL` to your PostgreSQL database.
3. Run the migration: `npx prisma migrate dev`
4. Seed the database: `npx prisma db seed`

## Data Model

- **Role** (enum): `PATRON` or `LIBRARIAN`
- **User**: email, name and a role (defaults to `PATRON`)
- **Genre**: a unique name and slug
- **Book**: title, author, unique ISBN, total and available copies, and a `genreId` that points to a Genre

## Schema Decisions

**Why Book references Genre instead of embedding it**

Each Book stores a `genreId` foreign key that points to a row in the Genre table,
instead of copying the genre's details inside every book.

- **No duplicated data.** The genre name lives in one place. If "Science Fiction"
  is renamed, one row changes instead of every book in that genre.
- **Consistency.** Embedded copies can drift apart ("Sci-Fi" vs "Science Fiction").
  With a foreign key, the database refuses a book whose genre does not exist.
- **Easy queries.** Finding all books in a genre is a simple filter on `genreId`,
  and Prisma can include the genre when needed.
- **It matches the real relationship.** One genre has many books, and a book belongs
  to one genre. That is a one-to-many relation, which relational databases are
  designed for.

**Other decisions**

- `Role` is an enum, so a user can only ever be `PATRON` or `LIBRARIAN`.
- `isbn`, `Genre.name` and `Genre.slug` are `@unique` to stop duplicates.
- `totalCopies` and `availableCopies` are separate so borrowing can later reduce
  availability without losing the total.