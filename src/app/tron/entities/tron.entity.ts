import { BusinessEntity } from '../../base/business.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity()
export class Tron extends BusinessEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true, unique: true })
  walletId: string;

  @OneToMany(() => Transaction, (transaction) => transaction.tron, {
    eager: false,
  })
  transactions: Transaction[];
}
