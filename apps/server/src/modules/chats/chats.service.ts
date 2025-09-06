import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OutboxService } from '../events/outbox.service';

@Injectable()
export class ChatsService {
  constructor(private prisma: PrismaService, private outbox: OutboxService) {}

  listByWorld(worldId: string) {
    return this.prisma.chat.findMany({ where: { worldId }, orderBy: { createdAt: 'desc' } });
  }

  async get(chatId: string, actor?: { role?: string; characterId?: string }) {
    const chat = await this.prisma.chat.findUnique({ where: { id: chatId } });
    if (!chat) return null;
    if (chat.kind === 'dm') {
      if ((actor?.role || '').toLowerCase() !== 'mj') {
        const isParticipant = await this.prisma.chatParticipant.findFirst({ where: { chatId, characterId: actor?.characterId || '' } });
        if (!isParticipant) return null;
      }
    }
    return chat;
  }

  async create(worldId: string, input: { kind: 'dm'|'world'|'place'; place_id?: string; participants?: string[] }) {
    const chat = await this.prisma.chat.create({ data: { worldId, kind: input.kind as any, placeId: input.place_id ?? null } });
    if (input.participants?.length) {
      await this.prisma.chatParticipant.createMany({
        data: input.participants.map((characterId) => ({ chatId: chat.id, characterId })),
        skipDuplicates: true,
      });
    }
    return chat;
  }

  async createMessage(chatId: string, fromCharacterId: string, content: string, toCharacterId?: string) {
    const message = await this.prisma.chatMessage.create({
      data: { chatId, fromCharacterId, toCharacterId: toCharacterId ?? null, content },
    });
    const chat = await this.prisma.chat.findUnique({ where: { id: chatId } });
    if (chat) {
      await this.outbox.enqueue({
        id: this.id(), type: 'chat.message.created', world_id: chat.worldId, at: new Date().toISOString(), data: { chat_id: chatId, message },
      });
    }
    return message;
  }

  async editMessage(chatId: string, messageId: string, content: string, actor?: { role?: string; characterId?: string }) {
    const current = await this.prisma.chatMessage.findUnique({ where: { id: messageId } });
    if (!current) return null;
    const isMJ = (actor?.role || '').toLowerCase() === 'mj';
    if (!isMJ && current.fromCharacterId !== actor?.characterId) {
      throw new Error('forbidden');
    }
    const message = await this.prisma.chatMessage.update({
      where: { id: messageId }, data: { content, edited: true, editedAt: new Date() },
    });
    const chat = await this.prisma.chat.findUnique({ where: { id: chatId } });
    if (chat) {
      await this.outbox.enqueue({ id: this.id(), type: 'chat.message.updated', world_id: chat.worldId, at: new Date().toISOString(), data: { chat_id: chatId, message } });
    }
    return message;
  }

  async deleteMessage(chatId: string, messageId: string, actor?: { role?: string; characterId?: string }) {
    const current = await this.prisma.chatMessage.findUnique({ where: { id: messageId } });
    if (!current) return null;
    const isMJ = (actor?.role || '').toLowerCase() === 'mj';
    if (!isMJ && current.fromCharacterId !== actor?.characterId) {
      throw new Error('forbidden');
    }
    const message = await this.prisma.chatMessage.update({
      where: { id: messageId }, data: { deleted: true, deletedAt: new Date() },
    });
    const chat = await this.prisma.chat.findUnique({ where: { id: chatId } });
    if (chat) {
      await this.outbox.enqueue({ id: this.id(), type: 'chat.message.deleted', world_id: chat.worldId, at: new Date().toISOString(), data: { chat_id: chatId, message } });
    }
    return message;
  }

  private id() { return (Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2)).slice(0, 24); }
}
