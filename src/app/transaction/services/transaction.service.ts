import { Injectable } from '@nestjs/common';
import { BusinessService } from '../../base/business.service';
import { Transaction } from '../entities/transaction.entity';
import { TransactionRepository } from '../repositories/transaction.repository';

@Injectable()
export class TransactionService extends BusinessService<Transaction> {
  constructor(private readonly transactionRepository: TransactionRepository) {
    super(transactionRepository);
  }
}