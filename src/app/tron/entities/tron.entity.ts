import { BusinessEntity } from '../../base/business.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tron extends BusinessEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true, unique: true })
  walletId: string;

  @Column({ nullable: true })
  transactionId: string;

  @Column({ nullable: true })
  blockNumber: number;

  @Column({ nullable: true })
  amount: number;
}
