import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { CommonsService } from 'src/commons/commons.service';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/commons/dto/pagination.dto';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger('TicketsService');

  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly commonsService: CommonsService,
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    try {
      const ticket = this.ticketRepository.create(createTicketDto);
      await this.ticketRepository.save(ticket);
      return ticket;
    } catch (error) {
      this.commonsService.handleDBExceptions(error, this.logger);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.ticketRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: string) {
    const ticket = await this.ticketRepository.findOneBy({ id });

    if (!ticket) throw new NotFoundException(`Ticket with id ${id} not found`);

    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    const ticket = await this.ticketRepository.preload({
      id,
      ...updateTicketDto,
    });

    if (!ticket) throw new NotFoundException(`Ticket with id ${id} not found`);

    try {
      await this.ticketRepository.save(ticket);
      return ticket;
    } catch (error) {
      this.commonsService.handleDBExceptions(error, this.logger);
    }
  }

  async remove(id: string) {
    const ticket = await this.findOne(id);
    await this.ticketRepository.remove(ticket);
  }
}
