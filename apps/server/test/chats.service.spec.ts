import { describe, it, expect } from 'vitest';
import { ChatsService } from '../src/modules/chats/chats.service';

function createPrismaMock() {
  return {
    chat: { findUnique: async (q: any) => ({ id: q.where.id, worldId: 'w1', kind: 'dm' }) },
    chatParticipant: { findFirst: async () => ({}) },
    chatMessage: {
      findUnique: async (q: any) => ({ id: q.where.id, fromCharacterId: 'c1', content: 'old' }),
      update: async ({ where, data }: any) => ({ id: where.id, ...data }),
    },
    historyEntry: { create: async () => ({}) },
  } as any;
}

describe('ChatsService permissions', () => {
  it('non-author cannot edit message unless MJ', async () => {
    const prisma = createPrismaMock();
    const outbox: any = { enqueue: async () => {} };
    const svc = new ChatsService(prisma, outbox);
    await expect(svc.editMessage('chat1', 'm1', 'new', { role: 'pj', characterId: 'c2' })).rejects.toThrow();
    await expect(svc.editMessage('chat1', 'm1', 'new', { role: 'mj' })).resolves.toBeTruthy();
  });
});

