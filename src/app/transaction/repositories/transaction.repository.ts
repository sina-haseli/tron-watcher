import { EntityRepository } from 'typeorm';
import { BusinessRepository } from '../../base/business.repository';
import { Transaction } from '../entities/transaction.entity';

@EntityRepository(Transaction)
export class TransactionRepository extends BusinessRepository<Transaction> {}
