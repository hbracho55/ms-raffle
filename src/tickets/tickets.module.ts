import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonsModule } from 'src/commons/commons.module';
import { Ticket } from './entities/ticket.entity';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
  imports: [TypeOrmModule.forFeature([Ticket]), CommonsModule],
})
export class TicketsModule {}
