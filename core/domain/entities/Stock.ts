export interface Stock {
    designation: string;
    unite: string;
    classe: string;
    stockDisponible: number;
    totalEntrees: number;
    totalSorties: number;
    sources: string[];
    destinations: string[];
  }
  
  export interface StockDetails extends Stock {
    achatId: string;
    entrees: StockMovement[];
    sorties: StockMovement[];
  }
  
  export interface StockMovement {
    id: string;
    date: Date;
    nombre: number;
    source?: string;
    destination?: string;
    observation?: string;
  }
