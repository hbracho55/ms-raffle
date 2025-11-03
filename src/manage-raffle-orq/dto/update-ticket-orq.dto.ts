import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketOrqDto } from './create-ticket-orq.dto';
import { IsArray } from 'class-validator';

export class UpdateTicketOrqDto extends PartialType(CreateTicketOrqDto) {
  @IsArray()
  ticketIds: string[];
}
