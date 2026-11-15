import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { mapPrismaError } from '../prisma/prisma-errors';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGenreDto) {
    try {
      return await this.prisma.genre.create({ data: dto });
    } catch (e) {
      mapPrismaError(e, 'Genre');
    }
  }

  findAll() {
    return this.prisma.genre.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: number) {
    const genre = await this.prisma.genre.findUnique({ where: { id } });
    if (!genre) throw new NotFoundException('Genre not found');
    return genre;
  }

  async update(id: number, dto: UpdateGenreDto) {
    try {
      return await this.prisma.genre.update({ where: { id }, data: dto });
    } catch (e) {
      mapPrismaError(e, 'Genre');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.genre.delete({ where: { id } });
    } catch (e) {
      mapPrismaError(e, 'Genre');
    }
  }
}