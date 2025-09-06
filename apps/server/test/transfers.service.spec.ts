import { describe, it, expect } from 'vitest';
import { TransfersService } from '../src/modules/transfers/transfers.service';

describe('TransfersService (unit)', () => {
  it('should reject when hand is occupied', async () => {
    const prisma: any = {
      item: {
        findUnique: async () => ({ id: 'i1', holderType: 'place', holderId: 'p1', hand: null }),
        findFirst: async () => ({ id: 'i2' }),
        update: async (_: any) => _,
      },
    };
    const svc = new TransfersService(prisma);
    await expect(
      svc.transfer({
        item_id: 'i1',
        from: { type: 'place', id: 'p1' },
        to: { type: 'character_hand', id: 'c1', hand: 'right' },
      })
    ).rejects.toThrow();
  });
});

