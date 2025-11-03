import { Raffle } from 'src/raffles/entities/raffle.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
  })
  username: string;

  @Column({
    type: 'text',
  })
  password: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  expiredAt?: string;

  @Column('text')
  secretQuestion: string;

  @Column('text')
  secretAnswer: string;

  @Column('text')
  status: string;

  @OneToMany(() => Raffle, (raffle) => raffle.adminId, { cascade: true })
  raffles?: Raffle[];
}
