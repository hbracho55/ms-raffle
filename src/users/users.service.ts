import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CommonsService } from 'src/commons/commons.service';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/commons/dto/pagination.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly commonsService: CommonsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.commonsService.handleDBExceptions(error, this.logger);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.userRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.commonsService.handleDBExceptions(error, this.logger);
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
