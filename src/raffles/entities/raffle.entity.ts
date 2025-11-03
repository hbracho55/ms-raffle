import { Ticket } from 'src/tickets/entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Raffle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
  })
  beneficiary: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: string;

  @Column('text')
  description: string;

  @Column('text')
  award1: string;

  @Column('text')
  award2: string;

  @Column('text')
  award3: string;

  @Column('text')
  payment: string;

  @Column('int')
  totalTickets: number;

  @Column('text')
  status: string;

  @ManyToOne(() => User, (user) => user.raffles, { eager: true })
  adminId: User;

  @OneToMany(() => Ticket, (ticket) => ticket.raffle, {
    cascade: true,
    eager: true,
  })
  tickets?: Ticket[];
}
