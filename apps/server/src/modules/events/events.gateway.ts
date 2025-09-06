import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('subscribe')
  handleSubscribe(@MessageBody() data: { world_id?: string }, @ConnectedSocket() client: Socket) {
    if (data?.world_id) {
      client.join(`world:${data.world_id}`);
    }
    return { ok: true };
  }

  broadcastToWorld(worldId: string, payload: any) {
    if (!this.server) return;
    this.server.to(`world:${worldId}`).emit('event', payload);
  }
}

