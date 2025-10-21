import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  username: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsString()
  @MinLength(1)
  secretQuestion: string;

  @IsString()
  @MinLength(1)
  secretAnswer: string;

  @IsString()
  status: string;
}
