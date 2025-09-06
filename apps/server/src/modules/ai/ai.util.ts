export function aiItemShape(item: any) {
  return {
    ai_schema: {
      type: 'item',
      item_type: item.type,
      visibility: item.visibility,
      holder: { type: item.holderType, id: item.holderId, hand: item.hand ?? null },
    },
    ai_summary: `${item.name} (${item.type})`,
    ai_tips: {
      actions: [
        ...(item.type === 'container' && !item.isOpen ? [{ rel: 'open', href: `/api/v1/items/${item.id}/open`, method: 'POST' }] : []),
      ],
    },
  };
}

export function aiSheetShape(sheet: any) {
  return {
    ai_schema: {
      type: 'sheet',
      slots: { hands: { left: null, right: null }, outfit: [] },
      purse: { gold: sheet.purseGold, silver: sheet.purseSilver, copper: sheet.purseCopper },
      visibility_threshold: sheet.vision ?? 0,
    },
    ai_summary: `${sheet.name}`,
    ai_tips: { actions: [] },
  };
}

