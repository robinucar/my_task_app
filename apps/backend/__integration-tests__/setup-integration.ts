import { execSync } from 'child_process';
import path from 'path';
import dotenv from 'dotenv';
import prisma from '../src/client';

// luading environment variables from .env.test
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

// Reset the DB before the whole test suite
beforeAll(() => {
  execSync(
    'npx prisma migrate reset --force --schema=apps/backend/prisma/schema.prisma --skip-seed',
    {
      stdio: 'inherit',
      env: {
        ...process.env,
      },
    },
  );
});

beforeEach(async () => {
  await prisma.task.deleteMany({});
});
// after all tests disconnect Prisma
afterAll(async () => {
  await prisma.$disconnect();
});
