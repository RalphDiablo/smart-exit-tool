import { TradeSetup } from '@/types/trade';

export const calculatePositionSize = (
  entryPrice: number,
  stopLoss: number,
  riskPercent: number,
  accountSize: number
): { positionSize: number; riskAmount: number } => {
  const riskAmount = (accountSize * riskPercent) / 100;
  const riskPerShare = Math.abs(entryPrice - stopLoss);
  const positionSize = riskPerShare > 0 ? riskAmount / riskPerShare : 0;
  
  return {
    positionSize: Number(positionSize.toFixed(4)),
    riskAmount: Number(riskAmount.toFixed(2))
  };
};

export const calculateTPAllocations = (positionSize: number) => {
  return {
    tp1Allocation: positionSize * 0.5,
    tp2Allocation: positionSize * 0.3,
    tp3Allocation: positionSize * 0.2
  };
};

export const calculateProfitPotential = (
  entryPrice: number,
  tp1: number,
  tp2: number,
  tp3: number,
  positionSize: number
) => {
  const allocations = calculateTPAllocations(positionSize);
  
  const tp1Profit = Math.abs(tp1 - entryPrice) * allocations.tp1Allocation;
  const tp2Profit = Math.abs(tp2 - entryPrice) * allocations.tp2Allocation;
  const tp3Profit = Math.abs(tp3 - entryPrice) * allocations.tp3Allocation;
  
  return {
    tp1Profit: Number(tp1Profit.toFixed(2)),
    tp2Profit: Number(tp2Profit.toFixed(2)),
    tp3Profit: Number(tp3Profit.toFixed(2)),
    totalProfit: Number((tp1Profit + tp2Profit + tp3Profit).toFixed(2))
  };
};

export const validateTradeSetup = (setup: Partial<TradeSetup>): string[] => {
  const errors: string[] = [];
  
  if (!setup.entryPrice || setup.entryPrice <= 0) {
    errors.push('Entry price must be greater than 0');
  }
  
  if (!setup.stopLoss || setup.stopLoss <= 0) {
    errors.push('Stop loss must be greater than 0');
  }
  
  if (!setup.riskPercent || setup.riskPercent <= 0 || setup.riskPercent > 20) {
    errors.push('Risk percent must be between 0.1% and 20%');
  }
  
  if (!setup.accountSize || setup.accountSize <= 0) {
    errors.push('Account size must be greater than 0');
  }
  
  if (setup.entryPrice && setup.stopLoss) {
    if (setup.entryPrice === setup.stopLoss) {
      errors.push('Entry price and stop loss cannot be the same');
    }
  }
  
  if (setup.entryPrice && setup.tp1) {
    const isLong = setup.entryPrice < (setup.tp1 || 0);
    
    if (setup.stopLoss) {
      if (isLong && setup.stopLoss >= setup.entryPrice) {
        errors.push('For long positions, stop loss must be below entry price');
      }
      if (!isLong && setup.stopLoss <= setup.entryPrice) {
        errors.push('For short positions, stop loss must be above entry price');
      }
    }
    
    if (setup.tp1 && setup.tp2 && setup.tp3) {
      if (isLong) {
        if (setup.tp1 <= setup.entryPrice || setup.tp2 <= setup.tp1 || setup.tp3 <= setup.tp2) {
          errors.push('For long positions, TP levels must be: TP1 > Entry > TP2 > TP3');
        }
      } else {
        if (setup.tp1 >= setup.entryPrice || setup.tp2 >= setup.tp1 || setup.tp3 >= setup.tp2) {
          errors.push('For short positions, TP levels must be: TP1 < Entry < TP2 < TP3');
        }
      }
    }
  }
  
  return errors;
};