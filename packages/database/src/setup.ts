import type { Prisma } from './generated/prisma/client.js';
import type { LogOptions } from './generated/prisma/internal/class.js';

import { PrismaPg } from '@prisma/adapter-pg';
import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaClient } from './generated/prisma/client.js';

export function createPrismaClient<
    Options extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
    LogOpts extends LogOptions<Options> = LogOptions<Options>,
    OmitOpts extends Prisma.PrismaClientOptions['omit'] = Options extends { omit: infer U } ? U : Prisma.PrismaClientOptions['omit'],
>({ connectionString, ...options }: { connectionString: string } & Options) {
const isPostgresUrl =
    connectionString.startsWith('postgres://') ||
    connectionString.startsWith('postgresql://');

  const isAccelerateUrl =
    connectionString.startsWith('prisma://') ||
    connectionString.startsWith('prisma+postgres://');

  if (!isPostgresUrl && !isAccelerateUrl) {
    throw new Error(
      `Invalid DATABASE_URL format: ${connectionString}. Must start with postgres:// or prisma+postgres://`
    );
  }

  if (isPostgresUrl) {
    const adapter = new PrismaPg({ connectionString });
    // Use adapter for Postgres connections
    return new PrismaClient({ ...options, adapter }) as unknown as PrismaClient<LogOpts, OmitOpts>;
  } else {
    // Accelerate mode: extend with Accelerate
    const baseClient = new PrismaClient({ ...(options as object) });
    const accelClient = baseClient.$extends(withAccelerate());
    return accelClient as unknown as PrismaClient<LogOpts, OmitOpts>;
  }
}
