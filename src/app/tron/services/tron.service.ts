import { Injectable } from '@nestjs/common';
import { CreateTronDto } from '../dto/create-tron.dto';
import { UpdateTronDto } from '../dto/update-tron.dto';
import { BusinessService } from '../../base/business.service';
import { Tron } from '../entities/tron.entity';
import { TronRepository } from '../repositories/tron.repository';
const TronWeb = require('tronweb');

const fullNode = 'https://api.nileex.io/';
const solidityNode = 'https://api.nileex.io/';
const eventServer = 'https://event.nileex.io/';
const privateKey = 'my test account private key'; // Contract events http endpoint

const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);

@Injectable()
export class TronService extends BusinessService<Tron> {
  constructor(private readonly tronRepository: TronRepository) {
    super(tronRepository);
  }
  async onModuleInit() {
    const fullNode = 'https://api.nileex.io/';
    const solidityNode = 'https://api.nileex.io/';
    const eventServer = 'https://event.nileex.io/';
    const privateKey = 'my test account private key'; // Contract events http endpoint

    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);
    const r = await this.getBalance(24076641);
    console.log(r);
  }

  async getBalance(blockNumber: number) {
    const transactions = await this.getBlock(blockNumber);
    if (transactions) {
      for (const element of transactions) {
        const to = await tronWeb.address.fromHex(
          element.raw_data.contract[0].parameter.value.to_address,
        );
        const wallets = await this.findAll();
        for (const item of wallets) {
          if (to === item.walletId) {
            const balance = element.raw_data.contract[0].parameter.value.amount;
            await this.updateById(item.id, {
              amount: balance,
              transactionId: element.txID,
              blockNumber: blockNumber,
            });
            console.log(to, item, element);
          }
        }
      }
    }
    blockNumber++;
    console.log(blockNumber);
    await this.getBalance(blockNumber);
    // You can also bind a `then` and `catch` method.
    // tronWeb.trx
    //   .getBalance(address)
    //   .then((balance) => {
    //     console.log({ balance });
    //   })
    //   .catch((err) => console.error(err));
    //
    // // If you'd like to use a similar API to Web3, provide a callback function.
    // tronWeb.trx.getBalance(address, (err, balance) => {
    //   if (err) return console.error(err);
    //
    //   console.log({ balance });
    // });
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
}
