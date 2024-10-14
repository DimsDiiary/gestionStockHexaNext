import { Stock, StockDetails } from '../entities/Stock';

export interface IStockRepository {
  calculateAllStocks(): Promise<Stock[]>;
  getStockDetailsForAchat(achatId: string): Promise<StockDetails | null>;
}