import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Calendar, Trophy } from 'lucide-react';

interface ProfitTrackerProps {
  dailyPnL: number;
  weeklyPnL: number;
  monthlyPnL: number;
  totalPnL: number;
}

export const ProfitTracker = ({ dailyPnL, weeklyPnL, monthlyPnL, totalPnL }: ProfitTrackerProps) => {
  const dailyGoal = 1000;
  const weeklyGoal = 7000; // $1k * 7 days
  const monthlyGoal = 20000; // First month target
  const totalGoal = 50000;

  const dailyProgress = Math.max(0, Math.min((dailyPnL / dailyGoal) * 100, 100));
  const weeklyProgress = Math.max(0, Math.min((weeklyPnL / weeklyGoal) * 100, 100));
  const monthlyProgress = Math.max(0, Math.min((monthlyPnL / monthlyGoal) * 100, 100));
  const totalProgress = Math.max(0, Math.min((totalPnL / totalGoal) * 100, 100));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5 text-profit" />
            Profit Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Daily Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Today's Salary</span>
              <span className="text-sm text-muted-foreground">
                ${dailyPnL >= 0 ? '+' : ''}{dailyPnL.toFixed(0)} / $1,000
              </span>
            </div>
            <Progress value={dailyProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {dailyProgress >= 100 ? '🎯 Daily goal achieved!' : `${dailyProgress.toFixed(0)}% to daily goal`}
            </p>
          </div>

          {/* Weekly Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">This Week</span>
              <span className="text-sm text-muted-foreground">
                ${weeklyPnL >= 0 ? '+' : ''}{weeklyPnL.toFixed(0)} / $7,000
              </span>
            </div>
            <Progress value={weeklyProgress} className="h-2" />
          </div>

          {/* Monthly Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">This Month</span>
              <span className="text-sm text-muted-foreground">
                ${monthlyPnL >= 0 ? '+' : ''}{monthlyPnL.toFixed(0)} / $20,000
              </span>
            </div>
            <Progress value={monthlyProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Motivational Card */}
      <Card className="bg-gradient-profit/10 border-profit/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-profit" />
            Path to Freedom
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Progress</span>
              <span className="text-sm font-medium text-profit">
                ${totalPnL >= 0 ? '+' : ''}{totalPnL.toFixed(0)} / $50,000
              </span>
            </div>
            <Progress value={totalProgress} className="h-3" />
            <p className="text-xs text-center text-muted-foreground">
              {totalProgress.toFixed(1)}% to financial freedom
            </p>
          </div>

          <div className="text-center p-4 bg-background/50 rounded-lg">
            <p className="text-sm font-medium text-profit mb-2">
              "Lock profits now, another short is always coming."
            </p>
            <p className="text-xs text-muted-foreground">
              Each $1,000 day brings you closer to your goal
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-warning" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-2 bg-accent/10 rounded">
              <span>Week 1-4:</span>
              <span className="font-medium">$15k-20k</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-accent/10 rounded">
              <span>Week 5-8:</span>
              <span className="font-medium">$30k-35k</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-profit/10 rounded border border-profit/20">
              <span>Week 9-12:</span>
              <span className="font-medium text-profit">$50k Goal</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};