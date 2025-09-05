import { Injectable } from '@nestjs/common';

@Injectable()
export class WorldsService {
  async list() { return []; }
  async get(id: string) { return { id }; }
  async create(input: any) { return { id: 'world_1', ...input }; }
  async update(id: string, input: any) { return { id, ...input }; }
}

