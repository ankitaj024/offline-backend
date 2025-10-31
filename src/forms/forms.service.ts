import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CreateFormDto {
  clientId: string;
  name: string;
  email: string;
  message: string;
  createdAt?: Date | string;
}

@Injectable()
export class FormsService {
  constructor(private readonly prisma: PrismaService) {}

  async createOne(dto: CreateFormDto) {
    try {
      return await this.prisma.formEntry.create({ data: {
        clientId: dto.clientId,
        name: dto.name,
        email: dto.email,
        message: dto.message,
        createdAt: dto.createdAt ? new Date(dto.createdAt) : new Date()
      }});
    } catch (e: any) {
      // idempotency on clientId
      const existing = await this.prisma.formEntry.findUnique({ where: { clientId: dto.clientId } });
      if (existing) return existing;
      throw e;
    }
  }

  async findAll() {
    return this.prisma.formEntry.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async sync(items: CreateFormDto[]) {
    const results: Array<{ clientId: string; ok: boolean; id?: string; error?: string }> = [];
    console.log(items)
    for (const item of items) {
      const { clientId, name, email, message, createdAt } = item || ({} as any);
      if (!clientId || !name || !email || !message) {
        results.push({ clientId, ok: false, error: 'missing fields' });
        continue;
      }
      try {
        const upserted = await this.prisma.formEntry.upsert({
          where: { clientId },
          update: {},
          create: {
            clientId, name, email, message, createdAt: createdAt ? new Date(createdAt) : new Date(),
          },
        });
        results.push({ clientId, ok: true, id: upserted.id });
      } catch (e: any) {
        results.push({ clientId, ok: false, error: e?.message || 'error' });
      }
    }
    return results;
  }
}


