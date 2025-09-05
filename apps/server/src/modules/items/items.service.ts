import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemsService {
  async list() { return []; }
  async get(id: string) { return { id }; }
  async create(input: any) { return { id: 'item_1', ...input }; }
  async update(id: string, input: any) { return { id, ...input }; }
}

