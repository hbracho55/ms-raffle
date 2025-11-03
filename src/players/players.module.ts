import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonsModule } from 'src/commons/commons.module';
import { Player } from './entities/player.entity';

@Module({
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService],
  imports: [TypeOrmModule.forFeature([Player]), CommonsModule],
})
export class PlayersModule {}
