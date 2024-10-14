import { IStockRepository } from '@/core/domain/port/IStockRepository';
import { Stock } from '@/core/domain/entities/Stock';

export class CalculateAllStocksUseCase {
  constructor(private readonly stockRepository: IStockRepository) {}

  async execute(): Promise<Stock[]> {
    return this.stockRepository.calculateAllStocks();
  }
}