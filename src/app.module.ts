import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RafflesModule } from './raffles/raffles.module';
import { UsersModule } from './users/users.module';
import { PlayersModule } from './players/players.module';
import { TicketsModule } from './tickets/tickets.module';
import { CommonsModule } from './commons/commons.module';
import { ManageRaffleOrqModule } from './manage-raffle-orq/manage-raffle-orq.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'requestDES',
      username: 'admin',
      password: 'admin',
      autoLoadEntities: true,
      synchronize: true,
    }),
    RafflesModule,
    UsersModule,
    PlayersModule,
    TicketsModule,
    CommonsModule,
    ManageRaffleOrqModule,
    UtilsModule,
  ],
})
export class AppModule { }
