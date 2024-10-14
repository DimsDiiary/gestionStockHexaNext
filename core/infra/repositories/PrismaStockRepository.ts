import { PrismaClient } from '@prisma/client';
import { IStockRepository } from '@/core/domain/port/IStockRepository';
import { Stock, StockDetails } from '@/core/domain/entities/Stock';


export class PrismaStockRepository implements IStockRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  async calculateAllStocks(): Promise<Stock[]> {
    const stocks = await this.prisma.stock.findMany();
    return stocks.map(stock => {
      const stockEntity = new Stock(stock);
      return stockEntity;
    });
  }

  async getStockDetailsForAchat(achatId: string): Promise<StockDetails | null> {
    const stockData = await this.prisma.stock.findUnique({
      where: { achatId: achatId },
    });
    return stockData ? new Stock(stockData).toStockDetails() : null;
  }
}
