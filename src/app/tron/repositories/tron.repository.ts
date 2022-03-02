import { EntityRepository } from 'typeorm';
import { BusinessRepository } from '../../base/business.repository';
import { Tron } from '../entities/tron.entity';

@EntityRepository(Tron)
export class TronRepository extends BusinessRepository<Tron> {
  async getTronByUserId(userId: number) {
    return this.createQueryBuilder('tron')
      .leftJoinAndSelect('tron.transactions', 'trans')
      .andWhere('tron.userId = :userId', { userId })
      .getMany();
  }

  async getTronByWalletAddress(walletAddress: string) {
    return this.createQueryBuilder('tron')
      .leftJoinAndSelect('tron.transactions', 'trans')
      .andWhere('tron.walletId = :walletAddress', { walletAddress })
      .getOne();
  }
}
