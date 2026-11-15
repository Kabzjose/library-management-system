import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function mapPrismaError(e: unknown, entity: string): never {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    switch (e.code) {
      case 'P2025':
        throw new NotFoundException(`${entity} not found`);
      case 'P2002':
        throw new ConflictException(`${entity} violates a unique constraint`);
      case 'P2003':
        throw new BadRequestException(
          'Related record does not exist, or this record is still referenced by others',
        );
    }
  }
  throw e;
}