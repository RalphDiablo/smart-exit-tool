import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trade, TradeStatus } from '@/types/trade';
import { calculateTPAllocations, calculateProfitPotential } from '@/utils/tradeCalculations';
import { Check, Target, TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface TradeDashboardProps {
  trade: Trade;
  onUpdateStatus: (status: Partial<TradeStatus>) => void;
}

export const TradeDashboard = ({ trade, onUpdateStatus }: TradeDashboardProps) => {
  const allocations = calculateTPAllocations(trade.positionSize || 0);
  const profits = calculateProfitPotential(
    trade.entryPrice,
    trade.tp1,
    trade.tp2,
    trade.tp3,
    trade.positionSize || 0
  );

  const progressValue = 
    (trade.status.tp1Hit ? 33 : 0) + 
    (trade.status.tp2Hit ? 33 : 0) + 
    (trade.status.tp3Hit ? 34 : 0);

  const isLong = trade.entryPrice < trade.tp1;

  const handleTPHit = (level: 'tp1' | 'tp2' | 'tp3') => {
    const updates: Partial<TradeStatus> = {};
    
    if (level === 'tp1' && !trade.status.tp1Hit) {
      updates.tp1Hit = true;
      updates.currentSL = trade.entryPrice; // Move SL to break-even
    } else if (level === 'tp2' && !trade.status.tp2Hit) {
      updates.tp2Hit = true;
      updates.trailingStopEnabled = true;
    } else if (level === 'tp3' && !trade.status.tp3Hit) {
      updates.tp3Hit = true;
      updates.isActive = false; // Trade complete
    }
    
    onUpdateStatus(updates);
  };

  return (
    <div className="space-y-6">
      {/* Trade Overview */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Active Trade Dashboard
            </div>
            <Badge 
              variant={trade.status.isActive ? "default" : "secondary"}
              className={trade.status.isActive ? "bg-profit text-profit-foreground" : ""}
            >
              {trade.status.isActive ? "Active" : "Completed"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-background rounded-lg">
              <div className="text-sm text-muted-foreground">Entry Price</div>
              <div className="font-mono text-lg text-foreground">${trade.entryPrice}</div>
            </div>
            <div className="text-center p-3 bg-background rounded-lg">
              <div className="text-sm text-muted-foreground">Current SL</div>
              <div className="font-mono text-lg text-loss">${trade.status.currentSL}</div>
            </div>
            <div className="text-center p-3 bg-background rounded-lg">
              <div className="text-sm text-muted-foreground">Position Size</div>
              <div className="font-mono text-lg text-foreground">{trade.positionSize}</div>
            </div>
            <div className="text-center p-3 bg-background rounded-lg">
              <div className="text-sm text-muted-foreground">Risk Amount</div>
              <div className="font-mono text-lg text-loss">${trade.riskAmount}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Trade Progress</span>
              <span>{Math.round(progressValue)}% Complete</span>
            </div>
            <Progress value={progressValue} className="h-3" />
          </div>

          {/* Take Profit Levels */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Take Profit Levels
            </h3>
            
            {/* TP1 */}
            <div className={`p-4 rounded-lg border transition-smooth ${
              trade.status.tp1Hit 
                ? 'bg-profit-subtle border-profit shadow-profit' 
                : 'bg-background border-border'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {trade.status.tp1Hit ? (
                    <Check className="h-4 w-4 text-profit" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                  )}
                  <span className="font-medium">TP1 - ${trade.tp1}</span>
                </div>
                <Badge variant="outline" className="text-xs">50% Position</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Allocation:</span>
                  <div className="font-mono">{allocations.tp1Allocation.toFixed(4)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Profit:</span>
                  <div className="font-mono text-profit">+${profits.tp1Profit}</div>
                </div>
              </div>
              {!trade.status.tp1Hit && trade.status.isActive && (
                <Button 
                  onClick={() => handleTPHit('tp1')}
                  size="sm" 
                  className="mt-2 bg-profit hover:bg-profit/90"
                >
                  Mark TP1 Hit
                </Button>
              )}
            </div>

            {/* TP2 */}
            <div className={`p-4 rounded-lg border transition-smooth ${
              trade.status.tp2Hit 
                ? 'bg-profit-subtle border-profit shadow-profit' 
                : 'bg-background border-border'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {trade.status.tp2Hit ? (
                    <Check className="h-4 w-4 text-profit" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                  )}
                  <span className="font-medium">TP2 - ${trade.tp2}</span>
                </div>
                <Badge variant="outline" className="text-xs">30% Position</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Allocation:</span>
                  <div className="font-mono">{allocations.tp2Allocation.toFixed(4)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Profit:</span>
                  <div className="font-mono text-profit">+${profits.tp2Profit}</div>
                </div>
              </div>
              {!trade.status.tp2Hit && trade.status.tp1Hit && trade.status.isActive && (
                <Button 
                  onClick={() => handleTPHit('tp2')}
                  size="sm" 
                  className="mt-2 bg-profit hover:bg-profit/90"
                >
                  Mark TP2 Hit
                </Button>
              )}
            </div>

            {/* TP3 */}
            <div className={`p-4 rounded-lg border transition-smooth ${
              trade.status.tp3Hit 
                ? 'bg-profit-subtle border-profit shadow-profit' 
                : 'bg-background border-border'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {trade.status.tp3Hit ? (
                    <Check className="h-4 w-4 text-profit" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                  )}
                  <span className="font-medium">TP3 - ${trade.tp3}</span>
                </div>
                <Badge variant="outline" className="text-xs">20% Position</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Allocation:</span>
                  <div className="font-mono">{allocations.tp3Allocation.toFixed(4)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Profit:</span>
                  <div className="font-mono text-profit">+${profits.tp3Profit}</div>
                </div>
              </div>
              {!trade.status.tp3Hit && trade.status.tp2Hit && trade.status.isActive && (
                <Button 
                  onClick={() => handleTPHit('tp3')}
                  size="sm" 
                  className="mt-2 bg-profit hover:bg-profit/90"
                >
                  Mark TP3 Hit
                </Button>
              )}
            </div>
          </div>

          {/* Trailing Stop Status */}
          {trade.status.trailingStopEnabled && (
            <div className="mt-6 p-4 bg-warning-subtle border border-warning rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-warning" />
                <span className="font-medium text-warning-foreground">Trailing Stop Active</span>
              </div>
              <p className="text-sm text-warning-foreground">
                Trailing stop is now active at {trade.status.trailingStopPercent}%. 
                Your stop loss will automatically adjust as the price moves in your favor.
              </p>
            </div>
          )}

          {/* Total Potential Profit */}
          <div className="mt-6 p-4 bg-primary/10 border border-primary rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="font-medium">Total Profit Potential</span>
            </div>
            <div className="text-2xl font-mono text-primary">+${profits.totalProfit}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};