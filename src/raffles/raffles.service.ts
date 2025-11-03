import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateRaffleDto } from './dto/create-raffle.dto';
import { UpdateRaffleDto } from './dto/update-raffle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Raffle } from './entities/raffle.entity';
import { Repository } from 'typeorm';
import { CommonsService } from 'src/commons/commons.service';
import { PaginationDto } from 'src/commons/dto/pagination.dto';

@Injectable()
export class RafflesService {
  private readonly logger = new Logger('RafflesService');

  constructor(
    @InjectRepository(Raffle)
    private readonly raffleRepository: Repository<Raffle>,
    private readonly commonsService: CommonsService,
  ) {}

  async create(createRaffleDto: CreateRaffleDto) {
    try {
      const raffle = this.raffleRepository.create(createRaffleDto);
      await this.raffleRepository.save(raffle);
      return raffle;
    } catch (error) {
      this.commonsService.handleDBExceptions(error, this.logger);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.raffleRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: string) {
    const raffle = await this.raffleRepository.findOneBy({ id });

    if (!raffle) throw new NotFoundException(`Raffle with id ${id} not found`);

    return raffle;
  }

  async update(id: string, updateRaffleDto: UpdateRaffleDto) {
    const raffle = await this.raffleRepository.preload({
      id,
      ...updateRaffleDto,
    });

    if (!raffle) throw new NotFoundException(`Raffle with id ${id} not found`);

    try {
      await this.raffleRepository.save(raffle);
      return raffle;
    } catch (error) {
      this.commonsService.handleDBExceptions(error, this.logger);
    }
  }

  async remove(id: string) {
    const raffle = await this.findOne(id);
    await this.raffleRepository.remove(raffle);
  }
}
