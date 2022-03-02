import { Get, Param } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { BusinessController } from '../../common/decorator/business-controller.decorator';

@BusinessController('/transaction', 'Transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }
}
