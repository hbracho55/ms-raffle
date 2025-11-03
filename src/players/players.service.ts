import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/commons/dto/pagination.dto';
import { CommonsService } from 'src/commons/commons.service';
import { SearchPlayerDto } from './dto/search-player.dto';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger('PlayersService');

  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    private readonly commonsService: CommonsService,
  ) {}

  async create(createPlayerDto: CreatePlayerDto) {
    try {
      const player = this.playerRepository.create(createPlayerDto);
      await this.playerRepository.save(player);
      return player;
    } catch (error) {
      this.commonsService.handleDBExceptions(error, this.logger);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.playerRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: string) {
    const player = await this.playerRepository.findOneBy({ id });

    if (!player) throw new NotFoundException(`Player with id ${id} not found`);

    return player;
  }

  async findByCriteria(filters: SearchPlayerDto) {
    const { page = 0, limit = 10, sortBy = 'id', order = 'ASC' } = filters;
    const query = this.playerRepository.createQueryBuilder('player');

    if (filters.name) {
      query.andWhere('player.name LIKE :name', { name: `${filters.name}%` });
    }

    if (filters.personalId !== undefined) {
      query.andWhere('player.personalId = :personalId', {
        personalId: filters.personalId,
      });
    }

    if (filters.email !== undefined) {
      query.andWhere('player.email = :email', {
        email: filters.email,
      });
    }

    if (filters.status !== undefined) {
      query.andWhere('player.status = :status', { status: filters.status });
    }

    query.orderBy(`player.${sortBy}`, order);
    query.skip(page * limit).take(limit);

    const [items, total] = await query.getManyAndCount();

    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAdvanced(criteria: {
    name?: string;
    personalId?: string;
    email?: string;
    status?: string;
  }): Promise<Player[]> {
    const query = this.playerRepository.createQueryBuilder('player');
    if (criteria.name) {
      query.andWhere('player.name LIKE :name', { name: `%${criteria.name}%` });
    }
    if (criteria.personalId !== undefined) {
      query.andWhere('player.personalId = :personalId', {
        personalId: criteria.personalId,
      });
    }
    if (criteria.email !== undefined) {
      query.andWhere('player.email = :email', {
        email: criteria.email,
      });
    }
    if (criteria.status !== undefined) {
      query.andWhere('player.status = :status', { status: criteria.status });
    }

    return query.getMany();
  }

  async update(id: string, updatePlayerDto: UpdatePlayerDto) {
    const player = await this.playerRepository.preload({
      id,
      ...updatePlayerDto,
    });

    if (!player) throw new NotFoundException(`Player with id ${id} not found`);

    try {
      await this.playerRepository.save(player);
      return player;
    } catch (error) {
      this.commonsService.handleDBExceptions(error, this.logger);
    }
  }

  async remove(id: string) {
    const player = await this.findOne(id);
    await this.playerRepository.remove(player);
  }
}
