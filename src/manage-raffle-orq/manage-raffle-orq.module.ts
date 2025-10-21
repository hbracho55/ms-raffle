import { Module } from '@nestjs/common';
import { ManageRaffleOrqService } from './manage-raffle-orq.service';
import { ManageRaffleOrqController } from './manage-raffle-orq.controller';
import { CommonsModule } from 'src/commons/commons.module';
import { RafflesModule } from 'src/raffles/raffles.module';
import { TicketsModule } from 'src/tickets/tickets.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  controllers: [ManageRaffleOrqController],
  providers: [ManageRaffleOrqService],
  imports: [RafflesModule, TicketsModule, CommonsModule, UtilsModule],
})
export class ManageRaffleOrqModule {}
