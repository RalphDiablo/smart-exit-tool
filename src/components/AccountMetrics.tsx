import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { AccountState } from '@/pages/FundedAccount';
import { Shield, TrendingDown, Calculator } from 'lucide-react';

interface AccountMetricsProps {
  account: AccountState;
  onUpdateRisk: (risk: number) => void;
}

export const AccountMetrics = ({ account, onUpdateRisk }: AccountMetricsProps) => {
  const maxPositionSize = (account.balance * account.riskPerTrade) / 100;
  const remainingRisk = 5000 + account.dailyPnL; // Daily loss limit remaining
  const totalDrawdownRemaining = 10000 + account.totalPnL; // Total drawdown remaining

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Account Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Per Trade Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Risk Per Trade</label>
            <Badge variant="outline">{account.riskPerTrade}%</Badge>
          </div>
          <Slider
            value={[account.riskPerTrade]}
            onValueChange={(value) => onUpdateRisk(value[0])}
            max={2}
            min={0.1}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0.1%</span>
            <span>Conservative: 0.5-1% • Aggressive: 1-2%</span>
            <span>2%</span>
          </div>
        </div>

        {/* Position Sizing */}
        <div className="p-4 bg-accent/10 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <TrendingDown className="h-4 w-4 text-profit" />
            Position Sizing (Short Bias)
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Max Position:</span>
              <div className="font-medium">${maxPositionSize.toFixed(0)}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Risk Amount:</span>
              <div className="font-medium text-warning">${maxPositionSize.toFixed(0)}</div>
            </div>
          </div>
        </div>

        {/* Risk Limits */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Shield className="h-4 w-4 text-loss" />
            Risk Limits
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-loss/10 rounded border border-loss/20">
              <span className="text-sm">Daily Loss Remaining:</span>
              <span className={`font-medium ${remainingRisk > 1000 ? 'text-profit' : 'text-loss'}`}>
                ${remainingRisk.toFixed(0)}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-warning/10 rounded border border-warning/20">
              <span className="text-sm">Total Drawdown Remaining:</span>
              <span className={`font-medium ${totalDrawdownRemaining > 2000 ? 'text-profit' : 'text-warning'}`}>
                ${totalDrawdownRemaining.toFixed(0)}
              </span>
            </div>
          </div>
        </div>

        {/* Prop Firm Rules */}
        <div className="p-4 bg-gradient-subtle rounded-lg border border-accent/20">
          <h4 className="font-medium text-sm mb-3">BreakoutProp Rules</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li>• Max 5% daily loss ($5,000)</li>
            <li>• Max 10% total drawdown ($10,000)</li>
            <li>• Must reach $50k profit target</li>
            <li>• No holding positions over weekends</li>
            <li>• Maximum 30 days to reach target</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};