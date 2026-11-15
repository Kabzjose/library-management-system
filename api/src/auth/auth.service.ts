import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, name: dto.name, password }, // role defaults to PATRON
      select: { id: true, email: true, name: true, role: true },
    });

    return { user, accessToken: this.sign(user.id, user.email, user.role) };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    const valid = user && (await bcrypt.compare(dto.password, user.password));
    if (!user || !valid) throw new UnauthorizedException('Invalid email or password');

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken: this.sign(user.id, user.email, user.role),
    };
  }

  private sign(id: number, email: string, role: string) {
    return this.jwt.sign({ sub: id, email, role });
  }
}