import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { EventEnvelope } from '../events/events.service';
import { OutboxService } from '../events/outbox.service';

type EndpointRef = { type: 'world'|'place'|'item'|'character_hand'|'character_outfit'; id: string; hand?: 'left'|'right' };
type Actor = { role?: string; characterId?: string };

@Injectable()
export class TransfersService {
  constructor(private prisma: PrismaService, private outbox: OutboxService) {}

  async transfer(input: { item_id: string; from: EndpointRef; to: EndpointRef; actor?: Actor }) {
    const item = await this.prisma.item.findUnique({ where: { id: input.item_id } });
    if (!item) throw new BadRequestException('item_not_found');

    // Validate source matches current holder
    const matchesSource =
      item.holderType === (input.from.type as any) &&
      item.holderId === input.from.id &&
      (input.from.type !== 'character_hand' || (item.hand as any) === input.from.hand);
    if (!matchesSource) throw new BadRequestException('invalid_source');

    // Minimal permissions: if not MJ, only allow affecting own character hands/outfits
    const actor = input.actor;
    const isMJ = (actor?.role || '').toLowerCase() === 'mj';
    if (!isMJ) {
      const touchingCharIds = [input.from, input.to]
        .filter(ep => ep.type === 'character_hand' || ep.type === 'character_outfit')
        .map(ep => ep.id);
      if (touchingCharIds.length > 0 && (!actor?.characterId || !touchingCharIds.every(id => id === actor!.characterId))) {
        throw new BadRequestException('forbidden');
      }
    }

    // Validate destination
    let update: any = { visibility: 10 };
    if (input.to.type === 'character_hand') {
      if (!input.to.hand) throw new BadRequestException('hand_required');
      const occupied = await this.prisma.item.findFirst({
        where: { holderType: 'character_hand' as any, holderId: input.to.id, hand: input.to.hand as any },
      });
      if (occupied) throw new BadRequestException('no_free_hand');
      update = { ...update, holderType: 'character_hand', holderId: input.to.id, hand: input.to.hand };
    } else if (input.to.type === 'item') {
      const container = await this.prisma.item.findUnique({ where: { id: input.to.id } });
      if (!container || container.type !== 'container') throw new BadRequestException('not_a_container');
      if (!container.isOpen) throw new BadRequestException('container_closed');
      update = { ...update, holderType: 'item', holderId: input.to.id, hand: null };
    } else if (input.to.type === 'place') {
      update = { ...update, holderType: 'place', holderId: input.to.id, hand: null };
    } else if (input.to.type === 'world') {
      update = { ...update, holderType: 'world', holderId: input.to.id, hand: null };
    } else if (input.to.type === 'character_outfit') {
      update = { ...update, holderType: 'character_outfit', holderId: input.to.id, hand: null };
    } else {
      throw new BadRequestException('invalid_destination');
    }

    const updated = await this.prisma.item.update({ where: { id: item.id }, data: update });
    await this.prisma.historyEntry.create({
      data: {
        worldId: updated.worldId,
        entityType: 'item',
        entityId: updated.id,
        action: 'transfer',
        before: { holderType: item.holderType, holderId: item.holderId, hand: item.hand },
        after: { holderType: updated.holderType, holderId: updated.holderId, hand: updated.hand },
      },
    });
    const evt: EventEnvelope = {
      id: cryptoRandomId(),
      type: 'item.transferred',
      world_id: updated.worldId,
      at: new Date().toISOString(),
      data: { item_id: updated.id, from: input.from, to: input.to, visibility_after: updated.visibility },
    };
    await this.outbox.enqueue(evt);
    return { ok: true, item: updated, from: input.from, to: input.to };
  }
}

function cryptoRandomId() {
  return randomBytes(12).toString('hex');
}
