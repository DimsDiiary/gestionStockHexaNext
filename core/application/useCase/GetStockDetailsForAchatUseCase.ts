import { IStockRepository } from '@/core/domain/port/IStockRepository';
import { StockDetails } from '@/core/domain/entities/Stock';

export class GetStockDetailsForAchatUseCase {
  constructor(private readonly stockRepository: IStockRepository) {}

  async execute(achatId: string): Promise<StockDetails | null> {
    return this.stockRepository.getStockDetailsForAchat(achatId);
  }
}