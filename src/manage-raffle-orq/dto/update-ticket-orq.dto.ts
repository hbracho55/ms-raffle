import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketOrqDto } from './create-ticket-orq.dto';

export class UpdateTicketOrqDto extends PartialType(CreateTicketOrqDto) {}
