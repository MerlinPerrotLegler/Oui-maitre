import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type EndpointRef = { type: 'world'|'place'|'item'|'character_hand'|'character_outfit'; id: string; hand?: 'left'|'right' };

@Injectable()
export class TransfersService {
  constructor(private prisma: PrismaService) {}

  async transfer(input: { item_id: string; from: EndpointRef; to: EndpointRef }) {
    const item = await this.prisma.item.findUnique({ where: { id: input.item_id } });
    if (!item) throw new BadRequestException('item_not_found');

    // Validate source matches current holder
    const matchesSource =
      item.holderType === (input.from.type as any) &&
      item.holderId === input.from.id &&
      (input.from.type !== 'character_hand' || (item.hand as any) === input.from.hand);
    if (!matchesSource) throw new BadRequestException('invalid_source');

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
    return { ok: true, item: updated, from: input.from, to: input.to };
  }
}

