import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  personalId: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  phone: string;

  @IsString()
  status: string;
}
