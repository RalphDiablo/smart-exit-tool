import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

const tradingRules = [
  {
    id: 1,
    rule: "Never exit early before TP1",
    description: "Patience is key. Let the trade develop according to your plan.",
    icon: CheckCircle2,
    severity: "high"
  },
  {
    id: 2,
    rule: "Never move SL backward",
    description: "Protect your capital. Stop loss moves only to secure profits.",
    icon: Shield,
    severity: "critical"
  },
  {
    id: 3,
    rule: "Never let a winner turn into a loser",
    description: "Once TP1 is hit, your SL moves to break-even automatically.",
    icon: TrendingUp,
    severity: "high"
  },
  {
    id: 4,
    rule: "Stick to position allocation",
    description: "50% at TP1, 30% at TP2, 20% at TP3. No exceptions.",
    icon: AlertCircle,
    severity: "medium"
  },
  {
    id: 5,
    rule: "Trust your analysis",
    description: "You did the research. Don't second-guess your plan.",
    icon: Heart,
    severity: "medium"
  }
];

export const EmotionalRules = () => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-loss';
      case 'high':
        return 'text-warning';
      case 'medium':
        return 'text-neutral';
      default:
        return 'text-muted-foreground';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-loss-subtle border-loss';
      case 'high':
        return 'bg-warning-subtle border-warning';
      case 'medium':
        return 'bg-neutral-subtle border-neutral';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Card className="h-fit sticky top-6 bg-gradient-card border-border shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Heart className="h-5 w-5 text-loss" />
          Trading Discipline
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Keep these rules visible at all times. Emotion is the enemy of profit.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {tradingRules.map((item) => {
          const IconComponent = item.icon;
          return (
            <div 
              key={item.id}
              className={`p-4 rounded-lg border transition-smooth ${getSeverityBg(item.severity)}`}
            >
              <div className="flex items-start gap-3">
                <IconComponent className={`h-5 w-5 mt-0.5 ${getSeverityColor(item.severity)}`} />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-foreground leading-tight">
                      {item.rule}
                    </h3>
                    <Badge 
                      variant="outline" 
                      className={`text-xs shrink-0 ${getSeverityColor(item.severity)}`}
                    >
                      {item.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Motivational Quote */}
        <div className="mt-6 p-4 bg-primary/10 border border-primary rounded-lg">
          <blockquote className="text-sm italic text-primary-foreground text-center">
            "The goal of a successful trader is to make the best trades. Money is secondary."
          </blockquote>
          <cite className="block text-xs text-muted-foreground text-center mt-2">
            — Alexander Elder
          </cite>
        </div>
      </CardContent>
    </Card>
  );
};