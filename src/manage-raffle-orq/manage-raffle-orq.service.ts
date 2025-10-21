import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CommonsService } from 'src/commons/commons.service';
import { DataSource } from 'typeorm';
import { Raffle } from 'src/raffles/entities/raffle.entity';
import { CreateTicketDto } from 'src/tickets/dto/create-ticket.dto';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { CreateRaffleOrqDto } from './dto/create-raffle-orq.dto';
import { UpdateTicketOrqDto } from './dto/update-ticket-orq.dto';
import { Player } from 'src/players/entities/player.entity';
import { EmailService } from 'src/utils/email.service';
//import { EmailService } from 'src/email/email.service';

@Injectable()
export class ManageRaffleOrqService {
  private readonly logger = new Logger('ManageRaffleOrqService');

  constructor(
    private readonly commonsService: CommonsService,
    private readonly datasource: DataSource,
    private readonly emailService: EmailService,
  ) {}

  async createRaffle(createRaffleOrqDto: CreateRaffleOrqDto) {
    const createRaffleDto = { ...createRaffleOrqDto };
    const queryRunner = this.datasource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Registrar la rifa
      const result = await queryRunner.manager.insert(Raffle, createRaffleDto);
      const raffleId = result.identifiers[0].id;
      const raffleDB = await queryRunner.manager.findOneBy(Raffle, {
        id: raffleId,
      });

      if (!raffleDB)
        throw new InternalServerErrorException(`Error while creating Raffle`);

      // Registrar los tickets para la rifa
      for (let index = 1; index <= raffleDB.totalTickets; index++) {
        const createTicketDto: CreateTicketDto = {
          number: index,
          raffle: raffleDB,
          winner1: false,
          winner2: false,
          winner3: false,
          status: 'Activo',
        };
        await queryRunner.manager.insert(Ticket, createTicketDto);
      }

      await queryRunner.commitTransaction();
      await queryRunner.release();

      // Consultar la rifa con los tickets incluidos
      const raffleWithTickets = await this.datasource
        .getRepository(Raffle)
        .findOne({
          where: { id: raffleDB.id },
          relations: ['tickets'],
        });

      if (!raffleWithTickets) {
        throw new InternalServerErrorException(
          'Raffle not found after creation',
        );
      }
      this.logger.log(`Raffle created with ${raffleDB.totalTickets} tickets.`);

      // Enviar correo al usuario
      //await this.emailService.sendMail(
      //  createRaffleOrqDto.adminEmail, // Correo del administrador o usuario
      //  'Raffle Created Successfully',
      //  `Your raffle with ID ${raffleWithTickets.id} has been created successfully with ${raffleWithTickets.totalTickets} tickets.`,
      //);

      return raffleWithTickets;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.commonsService.handleDBExceptions(error, this.logger);
    }
  }

  async updateTicket(id: string, updateTicketOrqDto: UpdateTicketOrqDto) {
    const updateTicketDto = { ...updateTicketOrqDto };
    const queryRunner = this.datasource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      if (!updateTicketOrqDto.player)
        throw new BadRequestException(
          `Player information is required to update ticket`,
        );

      // Obtener/Registrar informacion de jugador
      const playerDB = await queryRunner.manager.findOneBy(Player, {
        personalId: updateTicketOrqDto.player.personalId,
      });

      if (playerDB) {
        updateTicketDto.player = playerDB;
      } else {
        //create player
        const createPlayerDto = { ...updateTicketOrqDto.player };
        if (
          !createPlayerDto.name ||
          !createPlayerDto.email ||
          !createPlayerDto.phone ||
          !createPlayerDto.personalId ||
          !createPlayerDto.status
        )
          throw new BadRequestException(`Player information incomplete`);

        const playerRegistered = await queryRunner.manager.save(
          Player,
          createPlayerDto,
        );
        this.logger.log(`
          Player registered with personalId: ${playerRegistered.personalId}`);
        updateTicketDto.player = playerRegistered;
      }

      // Actualizar informacion de ticket
      const ticketDB = await queryRunner.manager.findOneBy(Ticket, { id });

      if (!ticketDB)
        throw new NotFoundException(`Ticket with id ${id} not found`);

      if (
        ticketDB.status !== 'Activo' &&
        updateTicketOrqDto.status == 'Reservado'
      )
        throw new BadRequestException(
          `Ticket with number ${ticketDB.number} not available to reserve`,
        );

      const updatedTicket = {
        ...ticketDB,
        ...updateTicketDto,
      };

      await queryRunner.manager.save(Ticket, updatedTicket);

      // Consultar info de la rifa
      const raffleDB = await queryRunner.manager.findOneBy(Raffle, {
        id: updatedTicket.raffle.id,
      });

      this.logger.log(`
        Ticket ${updatedTicket.number} ${updatedTicket.status} by player with personalId ${updatedTicket.player?.personalId}`);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      // Enviar correo al usuario
      const isWinner =
        updatedTicket.winner1 || updatedTicket.winner2 || updatedTicket.winner3;

      const htmlSubject = isWinner
        ? `¡Felicidades! Tu ticket número ${updatedTicket.number} ha resultado ganador.`
        : `Ticket de rifa número ${updatedTicket.number} ${updatedTicket.status}.`;

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h1 style="color: #4CAF50;">${
            isWinner
              ? '¡Ganaste un premio en la rifa!'
              : updatedTicket.status === 'Reservado'
                ? '¡Gracias por tu reserva!'
                : '¡Gracias por tu compra!'
          }</h1>
          <p>Hola <strong>${updatedTicket.player?.name}</strong>,</p>
          <p>Tu ticket de rifa número <strong>${updatedTicket.number}</strong> ${
            isWinner
              ? 'ha resultado ganador.'
              : `ha sido <strong>${updatedTicket.status}</strong>.`
          }</p>
          <p>Detalles:</p>
          <ul>
            ${
              isWinner
                ? `<li>${
                    updatedTicket.winner1
                      ? raffleDB?.award1
                      : updatedTicket.winner2
                        ? raffleDB?.award2
                        : raffleDB?.award3
                  }</li>`
                : `
                    <li><strong>Estado:</strong> ${updatedTicket.status}</li>
                    <li><strong>Rifa:</strong> ${raffleDB?.description}</li>
                    ${
                      updatedTicket.status === 'Reservado'
                        ? `<li><strong>Forma de pago:</strong> ${raffleDB?.payment}</li>`
                        : ''
                    }
                  `
            }
          </ul>
          <p>${isWinner ? '¡Felicidades!' : '¡Buena suerte!'}</p>
          <p>Atentamente,</p>
          <p><strong>El equipo organizador de la Rifa</strong></p>
        </div>
      `;

      if (updateTicketDto.status !== 'Activo') {
        await this.emailService.sendMail(
          updatedTicket.player?.email ?? 'hbracho55@hotmail.com',
          htmlSubject,
          htmlContent,
        );
      }

      return updatedTicket;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.commonsService.handleDBExceptions(error, this.logger);
    }
  }
}
