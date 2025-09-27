export interface TradeSetup {
  entryPrice: number;
  stopLoss: number;
  riskPercent: number;
  accountSize: number;
  tp1: number;
  tp2: number;
  tp3: number;
  positionSize?: number;
  riskAmount?: number;
}

export interface TradeStatus {
  isActive: boolean;
  tp1Hit: boolean;
  tp2Hit: boolean;
  tp3Hit: boolean;
  currentSL: number;
  trailingStopEnabled: boolean;
  trailingStopPercent: number;
}

export interface Trade extends TradeSetup {
  id: string;
  status: TradeStatus;
  createdAt: Date;
  symbol?: string;
  notes?: string;
}