import {
  IsBoolean,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsPositive,
  IsString,
} from 'class-validator';
import { Player } from 'src/players/entities/player.entity';
import { Raffle } from 'src/raffles/entities/raffle.entity';

export class CreateTicketOrqDto {
  @IsNumber()
  @IsPositive()
  number: number;

  @IsNotEmptyObject()
  raffle: Raffle;

  @IsObject()
  player: Player;

  @IsBoolean()
  winner1: boolean;

  @IsBoolean()
  winner2: boolean;

  @IsBoolean()
  winner3: boolean;

  @IsString()
  status: string;
}
