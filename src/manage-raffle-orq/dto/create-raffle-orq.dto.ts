import {
  IsInt,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateRaffleOrqDto {
  @IsString()
  @MinLength(1)
  beneficiary: string;

  @IsObject()
  adminId: User;

  @IsString()
  @IsOptional()
  date: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsString()
  @MinLength(1)
  award1: string;

  @IsString()
  @MinLength(1)
  award2: string;

  @IsString()
  @MinLength(1)
  award3: string;

  @IsString()
  @MinLength(1)
  payment: string;

  @IsInt()
  @IsPositive()
  totalTickets: number;

  @IsString()
  status: string;
}
