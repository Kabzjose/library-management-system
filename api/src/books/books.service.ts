import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { mapPrismaError } from '../prisma/prisma-errors';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBookDto) {
    try {
      return await this.prisma.book.create({ data: dto, include: { genre: true } });
    } catch (e) {
      mapPrismaError(e, 'Book');
    }
  }

  async findAll(params: { genreId?: number; search?: string; page: number; limit: number }) {
    const { genreId, search, page, limit } = params;

    const where: Prisma.BookWhereInput = {};
    if (genreId) where.genreId = genreId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.book.findMany({
        where,
        include: { genre: true },
        orderBy: { title: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.book.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({ where: { id }, include: { genre: true } });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(id: number, dto: UpdateBookDto) {
    try {
      return await this.prisma.book.update({ where: { id }, data: dto, include: { genre: true } });
    } catch (e) {
      mapPrismaError(e, 'Book');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.book.delete({ where: { id } });
    } catch (e) {
      mapPrismaError(e, 'Book');
    }
  }
}