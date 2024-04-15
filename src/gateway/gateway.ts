import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class SocketGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('socket', socket.id);
    });
  }

  @SubscribeMessage('newRoom')
  onNewRoom(@MessageBody() body: any) {
    console.log('onNewRoom body', body);
    this.server.emit('roomIsReady', { roomId: '1234-5678-90' });
  }
}
