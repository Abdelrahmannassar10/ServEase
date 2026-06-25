import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UseGuards, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { WsJwtGuard, WsRolesGuard } from '@common/guard';
import { Roles } from '@common/decorators';
import { Role } from '@common/types/enum';
import { SendMessageDto } from './dto/send-message.dto';

@WebSocketGateway({ namespace: '/chat', cors: { origin: process.env.FRONTEND_URL || '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsJwtGuard, WsRolesGuard)
  @Roles(Role.CUSTOMER, Role.PROVIDER)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @SubscribeMessage('chat:message')
  async onMessage(@ConnectedSocket() client: Socket, @MessageBody() data: SendMessageDto) {
    const user = client.data.user;
    try {
      const result = await this.chatService.sendMessage(user._id, data.message);
      client.emit('chat:response', result);
    } catch (err: any) {
      client.emit('chat:error', { message: err.message ?? 'Chatbot is unavailable, please try again.' });
    }
  }

  @UseGuards(WsJwtGuard, WsRolesGuard)
  @Roles(Role.CUSTOMER, Role.PROVIDER)
  @SubscribeMessage('chat:history')
  async onGetHistory(@ConnectedSocket() client: Socket) {
    const history = await this.chatService.getHistory(client.data.user._id);
    client.emit('chat:history', history);
  }
}
