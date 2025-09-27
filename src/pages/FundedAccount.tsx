import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AccountMetrics } from '@/components/AccountMetrics';
import { TradeLogger } from '@/components/TradeLogger';
import { ProfitTracker } from '@/components/ProfitTracker';
import { StrategyAlerts } from '@/components/StrategyAlerts';
import { TrendingDown, Target, DollarSign, AlertTriangle } from 'lucide-react';

export interface FundedTrade {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  entryPrice: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  takeProfit3: number;
  positionSize: number;
  riskAmount: number;
  riskReward: number;
  status: 'open' | 'closed';
  pnl: number;
  rMultiple: number;
  timestamp: Date;
}

export interface AccountState {
  balance: number;
  dailyPnL: number;
  weeklyPnL: number;
  monthlyPnL: number;
  totalPnL: number;
  riskPerTrade: number;
  tradesLeft: number;
  dailyGoalReached: boolean;
}

const FundedAccount = () => {
  const [account, setAccount] = useState<AccountState>({
    balance: 100000,
    dailyPnL: 0,
    weeklyPnL: 0,
    monthlyPnL: 0,
    totalPnL: 0,
    riskPerTrade: 0.5,
    tradesLeft: 10,
    dailyGoalReached: false
  });

  const [trades, setTrades] = useState<FundedTrade[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  const dailyGoal = 1000; // $1,000 daily target
  const maxDailyLoss = 5000; // 5% of $100k
  const maxTotalLoss = 10000; // 10% total drawdown
  const profitTarget = 50000; // $50k target

  const dailyProgress = Math.max(0, (account.dailyPnL / dailyGoal) * 100);
  const totalProgress = Math.max(0, (account.totalPnL / profitTarget) * 100);

  const addTrade = (trade: Omit<FundedTrade, 'id' | 'timestamp'>) => {
    const newTrade: FundedTrade = {
      ...trade,
      id: `trade_${Date.now()}`,
      timestamp: new Date()
    };
    
    setTrades(prev => [newTrade, ...prev]);
    
    // Update account balance
    setAccount(prev => {
      const newDailyPnL = prev.dailyPnL + trade.pnl;
      const newBalance = prev.balance + trade.pnl;
      const newTotalPnL = prev.totalPnL + trade.pnl;
      
      const dailyGoalReached = newDailyPnL >= dailyGoal;
      
      return {
        ...prev,
        balance: newBalance,
        dailyPnL: newDailyPnL,
        totalPnL: newTotalPnL,
        dailyGoalReached
      };
    });
  };

  const updateRiskPerTrade = (newRisk: number) => {
    setAccount(prev => ({ ...prev, riskPerTrade: newRisk }));
  };

  useEffect(() => {
    if (account.dailyPnL >= dailyGoal && !showAlert) {
      setShowAlert(true);
    }
  }, [account.dailyPnL, dailyGoal, showAlert]);

  const resetDaily = () => {
    setAccount(prev => ({
      ...prev,
      dailyPnL: 0,
      dailyGoalReached: false
    }));
    setShowAlert(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-profit rounded-lg">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Funded Account Strategy</h1>
                <p className="text-sm text-muted-foreground">BreakoutProp.com • $100K Account</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-profit/10 text-profit border-profit/20">
                Short-Biased
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetDaily}
                className="text-xs"
              >
                Reset Daily
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Daily Goal Alert */}
      {showAlert && (
        <div className="bg-gradient-profit/10 border-b border-profit/20 p-4">
          <div className="container mx-auto">
            <div className="flex items-center gap-3 text-profit">
              <Target className="h-5 w-5" />
              <span className="font-medium">🎯 Daily Goal Achieved! Consider stopping trades to avoid overtrading.</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Side - Main Dashboard */}
          <div className="lg:col-span-3 space-y-8">
            {/* Account Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-subtle border-accent/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-profit" />
                    Account Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    ${account.balance.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total P&L: ${account.totalPnL >= 0 ? '+' : ''}
                    <span className={account.totalPnL >= 0 ? 'text-profit' : 'text-loss'}>
                      {account.totalPnL.toLocaleString()}
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-subtle border-accent/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-warning" />
                    Daily Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Today: ${account.dailyPnL >= 0 ? '+' : ''}
                        <span className={account.dailyPnL >= 0 ? 'text-profit' : 'text-loss'}>
                          {account.dailyPnL.toFixed(0)}
                        </span>
                      </span>
                      <span className="text-muted-foreground">Goal: $1,000</span>
                    </div>
                    <Progress value={Math.min(dailyProgress, 100)} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {dailyProgress.toFixed(1)}% complete
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-subtle border-accent/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-loss" />
                    Risk Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Daily Loss Limit:</span>
                      <span className="text-loss">-$5,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Drawdown:</span>
                      <span className="text-loss">-$10,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Risk per Trade:</span>
                      <span className="text-warning">{account.riskPerTrade}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress to $50K Target */}
            <Card>
              <CardHeader>
                <CardTitle>Progress to $50K Target</CardTitle>
                <CardDescription>
                  Your journey to financial freedom • Projected timeline: 3 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Current Progress</span>
                    <span className="font-medium">${account.totalPnL.toLocaleString()} / $50,000</span>
                  </div>
                  <Progress value={totalProgress} className="h-3" />
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <div className="font-medium">Month 1</div>
                      <div className="text-muted-foreground">$15k-20k Target</div>
                    </div>
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <div className="font-medium">Month 2</div>
                      <div className="text-muted-foreground">$30k-35k Target</div>
                    </div>
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <div className="font-medium">Month 3</div>
                      <div className="text-muted-foreground">$50k Goal</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Metrics */}
            <AccountMetrics 
              account={account} 
              onUpdateRisk={updateRiskPerTrade}
            />

            {/* Trade Logger */}
            <TradeLogger 
              account={account}
              trades={trades}
              onAddTrade={addTrade}
            />
          </div>

          {/* Right Side - Strategy & Alerts */}
          <div className="lg:col-span-1 space-y-6">
            <StrategyAlerts dailyGoalReached={account.dailyGoalReached} />
            <ProfitTracker 
              dailyPnL={account.dailyPnL}
              weeklyPnL={account.weeklyPnL}
              monthlyPnL={account.monthlyPnL}
              totalPnL={account.totalPnL}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FundedAccount;