import { Injectable } from '@nestjs/common';
import { BusinessService } from '../../base/business.service';
import { Tron } from '../entities/tron.entity';
import { TronRepository } from '../repositories/tron.repository';
import { RedisService } from '../../../redis/redis.service';
import { CreateTronDto } from '../dto/create-tron.dto';
import { TransactionService } from '../../transaction/services/transaction.service';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
const TronWeb = require('tronweb');

const { FULL_NODE, SOLIDITY_NODE, EVENT_SERVER_NODE } = process.env;

const fullNode = FULL_NODE;
const solidityNode = SOLIDITY_NODE;
const eventServer = EVENT_SERVER_NODE;
// const fullNode = 'http://162.55.100.72:8090';
// const solidityNode = 'http://162.55.100.72:8091';
// const fullNode = 'http://162.55.100.72:8090';
// const solidityNode = 'http://162.55.100.72:8091';

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

  @Cron(CronExpression.EVERY_10_SECONDS)
  async ConfirmedTransactions() {
    try {
      const transactions =
        await this.transactionService.unConfirmedTransactions();
      const blockNumber = await tronWeb.trx.getCurrentBlock();
      for (const item of transactions) {
        if (item.blockNumber < blockNumber.block_header.raw_data.number - 6) {
          await this.transactionService.updateById(item.id, {
            isConfirmed: true,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getCurrentBlock() {
    try {
      const blockNumber = await tronWeb.trx.getCurrentBlock();
      return blockNumber.block_header.raw_data.number;
    } catch (error) {
      console.log(error);
    }
  }

  @Timeout(1000)
  async run() {
    let blockNumber = Number(await this.redisService.get('tron_blockNumber'));
    if (!blockNumber) {
      blockNumber = 0;
    }
    const currentBlock = await this.getCurrentBlock();
    console.log('CURRENT', currentBlock);
    if (blockNumber < currentBlock) {
      await this.loop(blockNumber, currentBlock).finally(() => {
        setTimeout(this.run.bind(this), 5000);
      });
    }
  }

  async loop(blockNumber: number, currentBlockNumber: number) {
    const number = currentBlockNumber - blockNumber;
    for (let i = 0; i < number; i++) {
      await this.getBalance(blockNumber);
      blockNumber++;
      console.log(blockNumber);
      await this.redisService.set('tron_blockNumber', blockNumber.toString());
    }
  }

  async getBalance(blockNumber: number) {
    try {
      const transactions = await this.getBlock(blockNumber);
      const block = await this.getBlockFound(blockNumber);
      if (transactions && block) {
        for (const element of transactions) {
          if (element.raw_data.contract[0].parameter.value.amount) {
            const to = await tronWeb.address.fromHex(
              element.raw_data.contract[0].parameter.value.to_address,
            );
            const wallets = JSON.parse(await this.redisService.get('wallets'))
              ? JSON.parse(await this.redisService.get('wallets'))
              : (await this.findAll()) || [];
            for (const item of wallets) {
              if (to === item.walletId) {
                const balance =
                  element.raw_data.contract[0].parameter.value.amount;
                await this.transactionService.save({
                  transactionId: element.txID,
                  amount: balance,
                  tron: await this.findOne(item.id),
                  blockNumber: blockNumber,
                  isConfirmed: false,
                });
              }
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
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

  async getBlockFound(blockNumber: number) {
    try {
      const block = await tronWeb.trx.getBlock(blockNumber);
      if (block) {
        return true;
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

  async getTron(userId: number) {
    return this.tronRepository.getTronByUserId(userId);
  }

  async getTronByWalletAddress(walletAddress: string) {
    return this.tronRepository.getTronByWalletAddress(walletAddress);
  }

  async setBlockNumberRedis(blockNumber: number) {
    const getCurrentBlock = await this.getCurrentBlock();
    if (blockNumber <= getCurrentBlock) {
      await this.redisService.set('tron_blockNumber', blockNumber.toString());
    }
  }

  async getLastBlockNumber() {
    return JSON.parse(await this.redisService.get('tron_blockNumber'));
  }
}
