import { Injectable } from '@nestjs/common';
import { BusinessService } from '../../base/business.service';
import { Tron } from '../entities/tron.entity';
import { TronRepository } from '../repositories/tron.repository';
import { RedisService } from '../../../redis/redis.service';
import { CreateTronDto } from '../dto/create-tron.dto';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { TransactionService } from '../../transaction/services/transaction.service';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
const TronWeb = require('tronweb');

const fullNode = 'https://api.nileex.io/';
const solidityNode = 'https://api.nileex.io/';
const eventServer = 'https://event.nileex.io/';

const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);

@Injectable()
export class TronService extends BusinessService<Tron> {
  constructor(
    private readonly tronRepository: TronRepository,
    private redisService: RedisService,
    private transactionService: TransactionService,
  ) {
    super(tronRepository);
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async setWalletsRedis() {
    const wallets = await this.findAll();
    if (wallets && wallets.length > 0) {
      await this.redisService.set('wallets', JSON.stringify(wallets));
    }
  }

  @Timeout(1000)
  async run() {
    let blockNumber = Number(await this.redisService.get('tron_blockNumber'));
    if (!blockNumber) {
      blockNumber = 0;
    }
    await this.getBalance(blockNumber);
  }

  async getBalance(blockNumber: number) {
    const transactions = await this.getBlock(blockNumber);
    if (transactions) {
      for (const element of transactions) {
        const to = await tronWeb.address.fromHex(
          element.raw_data.contract[0].parameter.value.to_address,
        );
        const wallets = JSON.parse(await this.redisService.get('wallets'))
          ? JSON.parse(await this.redisService.get('wallets'))
          : (await this.findAll()) || [];
        for (const item of wallets) {
          if (to === item.walletId) {
            const balance = element.raw_data.contract[0].parameter.value.amount;
            await this.transactionService.save({
              transactionId: element.txID,
              amount: balance,
              tron: await this.findOne(item.id),
              blockNumber: blockNumber,
            });
            console.log(to, item, element);
          }
        }
      }
    }
    blockNumber++;
    await this.redisService.set('tron_blockNumber', blockNumber.toString());
    console.log(blockNumber);
    await this.getBalance(blockNumber);
  }

  async getBlock(blockNumber: number) {
    try {
      const block = await tronWeb.trx.getBlock(blockNumber);
      if (block.transactions && block.transactions.length > 0) {
        return block.transactions;
      }
    } catch (e) {
      console.log(e);
    }
  }

  async createTron(tron: CreateTronDto) {
    const { walletAddress, userId } = tron;
    const result = await this.save({
      walletId: walletAddress,
      userId: userId,
    });
    return this.findOne(result.id);
  }
}
