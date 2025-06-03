console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DATABASE_URL is set:", !!process.env.DATABASE_URL);
console.log("TEST_DATABASE_URL is set:", !!process.env.TEST_DATABASE_URL);

const { PrismaClient } = require("@prisma/client");

const databaseUrl =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

prisma
  .$connect()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  });
module.exports = prisma;
