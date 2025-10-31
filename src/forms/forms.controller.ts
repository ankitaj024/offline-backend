import { Body, Controller, Get, Post } from '@nestjs/common';
import { FormsService } from './forms.service';

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post()
  async create(@Body() body: any) {
    const { clientId, name, email, message, createdAt } = body || {};
    if (!clientId || !name || !email || !message) {
      return { error: 'clientId, name, email, message required' };
    }
    return this.formsService.createOne({ clientId, name, email, message, createdAt });
  }

  @Get()
  async findAll() { return this.formsService.findAll(); }

  @Post('sync')
  async sync(@Body() body: any) {
    const items = Array.isArray(body?.items) ? body.items : [];
    return { ok: true, results: await this.formsService.sync(items) };
  }
}


