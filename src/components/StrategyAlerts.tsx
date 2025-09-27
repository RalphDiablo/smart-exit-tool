import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, Target, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';

interface StrategyAlertsProps {
  dailyGoalReached: boolean;
}

export const StrategyAlerts = ({ dailyGoalReached }: StrategyAlertsProps) => {
  return (
    <div className="space-y-6">
      {/* Daily Goal Alert */}
      {dailyGoalReached && (
        <Alert className="bg-profit/10 border-profit/20 text-profit">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Daily Goal Achieved!</strong> Consider stopping trades to avoid overtrading. Protect your gains.
          </AlertDescription>
        </Alert>
      )}

      {/* Short-Biased Strategy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingDown className="h-5 w-5 text-loss" />
            Short-Biased Strategy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="text-xs">PRIMARY</Badge>
              <span className="text-sm font-medium">Look for Short Setups</span>
            </div>
            
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-loss">•</span>
                <span>Resistance rejections near key levels</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-loss">•</span>
                <span>Failed rallies and breakdown patterns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-loss">•</span>
                <span>Overextended moves to the upside</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-loss">•</span>
                <span>Volume divergence on pumps</span>
              </li>
            </ul>
          </div>

          <Alert className="bg-warning/10 border-warning/20">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning">
              <strong>Market Alert:</strong> Watch for overextended rallies - perfect short entries often follow euphoric moves.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Trade Management Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-primary" />
            Trade Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 bg-profit/10 border border-profit/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-profit" />
                <span className="text-sm font-medium">Profit-Taking Plan</span>
              </div>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>TP1 (+1R): Close 50%, move SL to break-even</li>
                <li>TP2 (+2R): Close 30%, begin trailing stop</li>
                <li>TP3 (+3R+): Trail remaining 20% for extended moves</li>
              </ul>
            </div>

            <div className="p-3 bg-loss/10 border border-loss/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-loss" />
                <span className="text-sm font-medium">Risk Rules</span>
              </div>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>Minimum 1:2 risk-reward ratio</li>
                <li>Never risk more than 1% per trade</li>
                <li>Stop trading after daily goal ($1,000)</li>
                <li>Never move stop loss backward</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Reminders */}
      <Card className="bg-gradient-subtle border-accent/20">
        <CardHeader>
          <CardTitle className="text-lg">Mindset Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-background/50 rounded-lg text-center">
              <p className="font-medium text-profit">
                "Each $1,000 day is a paycheck"
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Consistency beats big wins
              </p>
            </div>
            
            <div className="p-3 bg-background/50 rounded-lg text-center">
              <p className="font-medium text-warning">
                "Lock profits, another opportunity is coming"
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Don't get greedy
              </p>
            </div>
            
            <div className="p-3 bg-background/50 rounded-lg text-center">
              <p className="font-medium text-primary">
                "Follow the plan, trust the process"
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Discipline = Freedom
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};