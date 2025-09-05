import { Injectable } from '@nestjs/common';

@Injectable()
export class CharactersService {
  async list() { return []; }
  async get(id: string) { return { id }; }
  async create(input: any) { return { id: 'char_1', ...input }; }
  async update(id: string, input: any) { return { id, ...input }; }
}

