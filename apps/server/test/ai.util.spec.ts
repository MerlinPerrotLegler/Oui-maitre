import { describe, it, expect } from 'vitest';
import { aiItemShape, aiSheetShape } from '../src/modules/ai/ai.util';

describe('AI shapes', () => {
  it('item shape contains type and holder', () => {
    const shaped = aiItemShape({ id: 'i', name: 'Epée', type: 'weapon', visibility: 5, holderType: 'place', holderId: 'p1' });
    expect(shaped.ai_schema.type).toBe('item');
    expect(shaped.ai_schema.holder.type).toBe('place');
  });

  it('sheet shape contains purse and threshold', () => {
    const s = aiSheetShape({ name: 'Eldra', purseGold: 5, purseSilver: 0, purseCopper: 0, vision: 3 });
    expect(s.ai_schema.purse.gold).toBe(5);
    expect(s.ai_schema.visibility_threshold).toBe(3);
  });
});

