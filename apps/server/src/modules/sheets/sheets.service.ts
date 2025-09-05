import { Injectable } from '@nestjs/common';

@Injectable()
export class SheetsService {
  async listTemplates() { return []; }
  async create(input: any) { return { id: 'sheet_1', ...input }; }
  async get(id: string) { return { id }; }
  async update(id: string, input: any) { return { id, ...input }; }
  async duplicate(id: string) { return { id: 'sheet_copy_of_' + id }; }
}

