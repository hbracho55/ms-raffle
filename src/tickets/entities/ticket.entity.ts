import { Player } from 'src/players/entities/player.entity';
import { Raffle } from 'src/raffles/entities/raffle.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  number: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: string;

  @Column('boolean')
  winner1?: boolean;

  @Column('boolean')
  winner2?: boolean;

  @Column('boolean')
  winner3?: boolean;

  @Column('text')
  status: string;

  @ManyToOne(() => Player, (player) => player.tickets, {
    onDelete: 'CASCADE',
    eager: true,
  })
  player?: Player;

  @ManyToOne(() => Raffle, (raffle) => raffle.tickets, { onDelete: 'CASCADE' })
  raffle: Raffle;
}
