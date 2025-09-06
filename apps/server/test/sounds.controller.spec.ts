import { describe, it, expect } from 'vitest';
import { SoundsController } from '../src/modules/sounds/sounds.controller';

describe('SoundsController', () => {
  it('rate limits after 5 requests', async () => {
    const ctrl = new SoundsController({ enqueue: async () => {} } as any, { historyEntry: { create: async () => {} } } as any);
    const worldId = 'w1';
    for (let i = 0; i < 5; i++) {
      const res = await ctrl.play(worldId, { url: 'https://example.com/sound.mp3' });
      expect(res.ok).toBe(true);
    }
    await expect(ctrl.play(worldId, { url: 'https://example.com/sound.mp3' })).rejects.toThrow();
  });
});

