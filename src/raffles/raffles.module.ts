import { Module } from '@nestjs/common';
import { RafflesService } from './raffles.service';
import { RafflesController } from './raffles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Raffle } from './entities/raffle.entity';
import { CommonsModule } from 'src/commons/commons.module';

@Module({
  controllers: [RafflesController],
  providers: [RafflesService],
  exports: [RafflesService],
  imports: [TypeOrmModule.forFeature([Raffle]), CommonsModule],
})
export class RafflesModule {}
