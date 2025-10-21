import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ManageRaffleOrqService } from './manage-raffle-orq.service';
import { CreateRaffleOrqDto } from './dto/create-raffle-orq.dto';
import { UpdateTicketOrqDto } from './dto/update-ticket-orq.dto';

@Controller('manage-raffle-orq')
export class ManageRaffleOrqController {
  constructor(
    private readonly manageRaffleOrqService: ManageRaffleOrqService,
  ) {}

  @Post('raffles')
  createRaffle(@Body() createRaffleOrqDto: CreateRaffleOrqDto) {
    return this.manageRaffleOrqService.createRaffle(createRaffleOrqDto);
  }

  @Patch('tickets/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTicketOrqDto: UpdateTicketOrqDto,
  ) {
    return this.manageRaffleOrqService.updateTicket(id, updateTicketOrqDto);
  }
}
