import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class CommonsService {
  
  handleDBExceptions(error: any, logger: any){

    if (error.code === '23505')
    throw new BadRequestException(error.detail);

    if (error.code === '22P02')
    throw new BadRequestException('Wrong value in id nested');

    if (error.code === '23503')
    throw new BadRequestException(error.detail);

    logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
