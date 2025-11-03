import { Controller, Post, Body, Patch } from '@nestjs/common';
import { ManageRaffleOrqService } from './manage-raffle-orq.service';
import { CreateRaffleOrqDto } from './dto/create-raffle-orq.dto';
import { UpdateTicketOrqDto } from './dto/update-ticket-orq.dto';
import { SendEmailDto } from './dto/send-email.dto';

@Controller('manage-raffle-orq')
export class ManageRaffleOrqController {
  constructor(
    private readonly manageRaffleOrqService: ManageRaffleOrqService,
  ) {}

  @Post('raffles')
  createRaffle(@Body() createRaffleOrqDto: CreateRaffleOrqDto) {
    return this.manageRaffleOrqService.createRaffle(createRaffleOrqDto);
  }

  @Patch('tickets')
  update(@Body() updateTicketOrqDto: UpdateTicketOrqDto) {
    return this.manageRaffleOrqService.updateTicket(updateTicketOrqDto);
  }

  @Post('send-email-no-winner')
  sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.manageRaffleOrqService.sendEmailNoWinner(sendEmailDto);
  }
}
