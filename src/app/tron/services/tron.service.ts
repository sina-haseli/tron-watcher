import { Injectable } from '@nestjs/common';
import { CreateTronDto } from '../dto/create-tron.dto';
import { UpdateTronDto } from '../dto/update-tron.dto';
import { lastValueFrom } from 'rxjs';
const TronWeb = require('tronweb');

const fullNode = 'https://api.nileex.io/';
const solidityNode = 'https://api.nileex.io/';
const eventServer = 'https://event.nileex.io/';
const privateKey = 'my test account private key'; // Contract events http endpoint

const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);

@Injectable()
export class TronService {
  create(createTronDto: CreateTronDto) {
    return 'This action adds a new tron';
  }

  findAll() {
    return `This action returns all tron`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tron`;
  }

  update(id: number, updateTronDto: UpdateTronDto) {
    return `This action updates a #${id} tron`;
  }

  remove(id: number) {
    return `This action removes a #${id} tron`;
  }

  async onModuleInit() {
    const fullNode = 'https://api.nileex.io/';
    const solidityNode = 'https://api.nileex.io/';
    const eventServer = 'https://event.nileex.io/';
    const privateKey = 'my test account private key'; // Contract events http endpoint

    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);
    const r = await this.getBalance();
    console.log(r);
  }

  async getBalance() {
    const address =
      'c47fd95c1f0f01b4f8b34ee396f4ae7ddae3c58cf4c6251de01a57b74ab5f1c1';
    const getTransaction = await tronWeb.trx.getTransaction(address);
    const getTransactionInfo = await tronWeb.trx.getTransactionInfo(address);
    const data = getTransaction.raw_data.contract[0].parameter.value;
    const test = {
      from: tronWeb.address.fromHex(data.owner_address),
      to: tronWeb.address.fromHex(data.to_address),
      amount: tronWeb.fromSun(data.amount),
      ref_block_hash: getTransaction.raw_data.ref_block_hash,
      txID: getTransaction.txID,
    };
    console.log(test, test.ref_block_hash, 1);

    const da = await tronWeb.trx.getBlock(getTransactionInfo.blockNumber);
    console.log(2, getTransactionInfo, 2);
    console.log(3, da, 3);
    // The majority of the function calls are asynchronus,
    // meaning that they cannot return the result instantly.
    // These methods therefore return a promise, which you can await.
    const balance = await tronWeb.trx.getBalance(address);
    console.log({ balance });

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
}
