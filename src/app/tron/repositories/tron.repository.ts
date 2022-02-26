import { EntityRepository } from 'typeorm';
import { BusinessRepository } from '../../base/business.repository';
import { Tron } from '../entities/tron.entity';

@EntityRepository(Tron)
export class TronRepository extends BusinessRepository<Tron> {}
