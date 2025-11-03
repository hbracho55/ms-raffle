import { IsString, IsNotEmpty, IsEmail, IsNumber } from 'class-validator';

export class SendEmailDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  number: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  beneficiary: string;
}
