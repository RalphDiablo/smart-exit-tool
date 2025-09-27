import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AccountState, FundedTrade } from '@/pages/FundedAccount';
import { Plus, TrendingDown, TrendingUp, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TradeLoggerProps {
  account: AccountState;
  trades: FundedTrade[];
  onAddTrade: (trade: Omit<FundedTrade, 'id' | 'timestamp'>) => void;
}

export const TradeLogger = ({ account, trades, onAddTrade }: TradeLoggerProps) => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '',
    side: 'short' as 'long' | 'short',
    entryPrice: '',
    stopLoss: '',
    takeProfit1: '',
    takeProfit2: '',
    takeProfit3: '',
    outcome: 'tp1' as 'tp1' | 'tp2' | 'tp3' | 'sl'
  });

  const calculateTrade = () => {
    const entry = parseFloat(formData.entryPrice);
    const sl = parseFloat(formData.stopLoss);
    const tp1 = parseFloat(formData.takeProfit1);
    const tp2 = parseFloat(formData.takeProfit2);
    const tp3 = parseFloat(formData.takeProfit3);

    if (!entry || !sl || !tp1) return null;

    const riskAmount = (account.balance * account.riskPerTrade) / 100;
    const riskPerShare = Math.abs(entry - sl);
    const positionSize = riskPerShare > 0 ? riskAmount / riskPerShare : 0;

    let pnl = 0;
    let rMultiple = 0;

    if (formData.outcome === 'sl') {
      pnl = -riskAmount;
      rMultiple = -1;
    } else if (formData.outcome === 'tp1') {
      const profit = Math.abs(tp1 - entry) * positionSize * 0.5; // 50% position
      pnl = profit;
      rMultiple = profit / riskAmount;
    } else if (formData.outcome === 'tp2') {
      const tp1Profit = Math.abs(tp1 - entry) * positionSize * 0.5;
      const tp2Profit = Math.abs(tp2 - entry) * positionSize * 0.3;
      pnl = tp1Profit + tp2Profit;
      rMultiple = pnl / riskAmount;
    } else if (formData.outcome === 'tp3') {
      const tp1Profit = Math.abs(tp1 - entry) * positionSize * 0.5;
      const tp2Profit = Math.abs(tp2 - entry) * positionSize * 0.3;
      const tp3Profit = Math.abs(tp3 - entry) * positionSize * 0.2;
      pnl = tp1Profit + tp2Profit + tp3Profit;
      rMultiple = pnl / riskAmount;
    }

    const riskReward = tp1 ? Math.abs(tp1 - entry) / Math.abs(entry - sl) : 0;

    return {
      positionSize,
      riskAmount,
      pnl,
      rMultiple,
      riskReward
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (account.dailyGoalReached) {
      toast({
        title: "Daily Goal Reached",
        description: "Consider stopping trades to avoid overtrading.",
        variant: "destructive"
      });
      return;
    }

    const calculation = calculateTrade();
    if (!calculation) {
      toast({
        title: "Invalid Trade Data",
        description: "Please check your entry, stop loss, and take profit values.",
        variant: "destructive"
      });
      return;
    }

    const trade: Omit<FundedTrade, 'id' | 'timestamp'> = {
      symbol: formData.symbol.toUpperCase(),
      side: formData.side,
      entryPrice: parseFloat(formData.entryPrice),
      stopLoss: parseFloat(formData.stopLoss),
      takeProfit1: parseFloat(formData.takeProfit1),
      takeProfit2: parseFloat(formData.takeProfit2) || 0,
      takeProfit3: parseFloat(formData.takeProfit3) || 0,
      positionSize: calculation.positionSize,
      riskAmount: calculation.riskAmount,
      riskReward: calculation.riskReward,
      status: 'closed',
      pnl: calculation.pnl,
      rMultiple: calculation.rMultiple
    };

    onAddTrade(trade);
    setShowForm(false);
    setFormData({
      symbol: '',
      side: 'short',
      entryPrice: '',
      stopLoss: '',
      takeProfit1: '',
      takeProfit2: '',
      takeProfit3: '',
      outcome: 'tp1'
    });

    toast({
      title: "Trade Logged",
      description: `${trade.side.toUpperCase()} ${trade.symbol} - P&L: $${trade.pnl.toFixed(0)}`,
      variant: trade.pnl >= 0 ? "default" : "destructive"
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Trade Logger
          </CardTitle>
          <Button 
            onClick={() => setShowForm(!showForm)}
            size="sm"
            disabled={account.dailyGoalReached}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Log Trade
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-accent/10 rounded-lg border">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                  id="symbol"
                  value={formData.symbol}
                  onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                  placeholder="BTCUSDT"
                  required
                />
              </div>
              <div>
                <Label htmlFor="side">Side</Label>
                <Select value={formData.side} onValueChange={(value: 'long' | 'short') => 
                  setFormData(prev => ({ ...prev, side: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short (Recommended)</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="entry">Entry Price</Label>
                <Input
                  id="entry"
                  type="number"
                  step="0.01"
                  value={formData.entryPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, entryPrice: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sl">Stop Loss</Label>
                <Input
                  id="sl"
                  type="number"
                  step="0.01"
                  value={formData.stopLoss}
                  onChange={(e) => setFormData(prev => ({ ...prev, stopLoss: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="tp1">TP1 (50%)</Label>
                <Input
                  id="tp1"
                  type="number"
                  step="0.01"
                  value={formData.takeProfit1}
                  onChange={(e) => setFormData(prev => ({ ...prev, takeProfit1: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="tp2">TP2 (30%)</Label>
                <Input
                  id="tp2"
                  type="number"
                  step="0.01"
                  value={formData.takeProfit2}
                  onChange={(e) => setFormData(prev => ({ ...prev, takeProfit2: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="tp3">TP3 (20%)</Label>
                <Input
                  id="tp3"
                  type="number"
                  step="0.01"
                  value={formData.takeProfit3}
                  onChange={(e) => setFormData(prev => ({ ...prev, takeProfit3: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="outcome">Trade Outcome</Label>
              <Select value={formData.outcome} onValueChange={(value: any) => 
                setFormData(prev => ({ ...prev, outcome: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tp1">Hit TP1 (50% closed)</SelectItem>
                  <SelectItem value="tp2">Hit TP2 (80% closed)</SelectItem>
                  <SelectItem value="tp3">Hit TP3 (100% closed)</SelectItem>
                  <SelectItem value="sl">Hit Stop Loss</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Log Trade</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Trade History Table */}
        <div className="space-y-4">
          <h4 className="font-medium">Recent Trades</h4>
          {trades.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No trades logged yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Side</TableHead>
                    <TableHead>Entry</TableHead>
                    <TableHead>R:R</TableHead>
                    <TableHead>P&L</TableHead>
                    <TableHead>R Multiple</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trades.slice(0, 10).map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell className="font-medium">{trade.symbol}</TableCell>
                      <TableCell>
                        <Badge variant={trade.side === 'short' ? 'destructive' : 'default'} className="text-xs">
                          {trade.side === 'short' ? (
                            <><TrendingDown className="h-3 w-3 mr-1" />SHORT</>
                          ) : (
                            <><TrendingUp className="h-3 w-3 mr-1" />LONG</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>${trade.entryPrice}</TableCell>
                      <TableCell>1:{trade.riskReward.toFixed(1)}</TableCell>
                      <TableCell className={trade.pnl >= 0 ? 'text-profit' : 'text-loss'}>
                        ${trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(0)}
                      </TableCell>
                      <TableCell className={trade.rMultiple >= 0 ? 'text-profit' : 'text-loss'}>
                        {trade.rMultiple >= 0 ? '+' : ''}{trade.rMultiple.toFixed(1)}R
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};