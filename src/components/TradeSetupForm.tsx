import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TradeSetup } from '@/types/trade';
import { calculatePositionSize, validateTradeSetup } from '@/utils/tradeCalculations';
import { Calculator, TrendingUp } from 'lucide-react';

interface TradeSetupFormProps {
  onSubmit: (setup: TradeSetup) => void;
  initialData?: Partial<TradeSetup>;
}

export const TradeSetupForm = ({ onSubmit, initialData }: TradeSetupFormProps) => {
  const [formData, setFormData] = useState<Partial<TradeSetup>>({
    entryPrice: initialData?.entryPrice || undefined,
    stopLoss: initialData?.stopLoss || undefined,
    riskPercent: initialData?.riskPercent || 2,
    accountSize: initialData?.accountSize || undefined,
    tp1: initialData?.tp1 || undefined,
    tp2: initialData?.tp2 || undefined,
    tp3: initialData?.tp3 || undefined,
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [positionCalc, setPositionCalc] = useState<{
    positionSize: number;
    riskAmount: number;
  } | null>(null);

  useEffect(() => {
    if (formData.entryPrice && formData.stopLoss && formData.riskPercent && formData.accountSize) {
      const calc = calculatePositionSize(
        formData.entryPrice,
        formData.stopLoss,
        formData.riskPercent,
        formData.accountSize
      );
      setPositionCalc(calc);
    } else {
      setPositionCalc(null);
    }
  }, [formData.entryPrice, formData.stopLoss, formData.riskPercent, formData.accountSize]);

  const handleInputChange = (field: keyof TradeSetup, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, [field]: numValue }));
    
    // Clear errors when user makes changes
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateTradeSetup(formData);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!positionCalc) {
      setErrors(['Unable to calculate position size']);
      return;
    }

    const completeSetup: TradeSetup = {
      entryPrice: formData.entryPrice!,
      stopLoss: formData.stopLoss!,
      riskPercent: formData.riskPercent!,
      accountSize: formData.accountSize!,
      tp1: formData.tp1!,
      tp2: formData.tp2!,
      tp3: formData.tp3!,
      positionSize: positionCalc.positionSize,
      riskAmount: positionCalc.riskAmount,
    };

    onSubmit(completeSetup);
  };

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Calculator className="h-5 w-5 text-primary" />
          Pre-Trade Setup
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Risk Management Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Risk Management
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountSize" className="text-foreground">Account Size ($)</Label>
                <Input
                  id="accountSize"
                  type="number"
                  step="0.01"
                  placeholder="10000"
                  value={formData.accountSize || ''}
                  onChange={(e) => handleInputChange('accountSize', e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="riskPercent" className="text-foreground">Risk % of Account</Label>
                <Input
                  id="riskPercent"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="20"
                  placeholder="2"
                  value={formData.riskPercent || ''}
                  onChange={(e) => handleInputChange('riskPercent', e.target.value)}
                  className="bg-background border-border"
                />
              </div>
            </div>
          </div>

          {/* Entry & Stop Loss Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Entry & Risk
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entryPrice" className="text-foreground">Entry Price ($)</Label>
                <Input
                  id="entryPrice"
                  type="number"
                  step="0.0001"
                  placeholder="50000"
                  value={formData.entryPrice || ''}
                  onChange={(e) => handleInputChange('entryPrice', e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stopLoss" className="text-foreground">Stop Loss ($)</Label>
                <Input
                  id="stopLoss"
                  type="number"
                  step="0.0001"
                  placeholder="48000"
                  value={formData.stopLoss || ''}
                  onChange={(e) => handleInputChange('stopLoss', e.target.value)}
                  className="bg-background border-border"
                />
              </div>
            </div>
          </div>

          {/* Take Profit Levels */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Take Profit Levels
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tp1" className="text-profit">TP1 (50%)</Label>
                <Input
                  id="tp1"
                  type="number"
                  step="0.0001"
                  placeholder="52000"
                  value={formData.tp1 || ''}
                  onChange={(e) => handleInputChange('tp1', e.target.value)}
                  className="bg-background border-border focus:ring-profit"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tp2" className="text-profit">TP2 (30%)</Label>
                <Input
                  id="tp2"
                  type="number"
                  step="0.0001"
                  placeholder="55000"
                  value={formData.tp2 || ''}
                  onChange={(e) => handleInputChange('tp2', e.target.value)}
                  className="bg-background border-border focus:ring-profit"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tp3" className="text-profit">TP3 (20%)</Label>
                <Input
                  id="tp3"
                  type="number"
                  step="0.0001"
                  placeholder="60000"
                  value={formData.tp3 || ''}
                  onChange={(e) => handleInputChange('tp3', e.target.value)}
                  className="bg-background border-border focus:ring-profit"
                />
              </div>
            </div>
          </div>

          {/* Position Size Display */}
          {positionCalc && (
            <div className="p-4 bg-profit-subtle rounded-lg border border-profit/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-profit" />
                <span className="text-sm font-medium text-profit">Calculated Position</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Position Size:</span>
                  <div className="font-mono text-foreground">{positionCalc.positionSize}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Risk Amount:</span>
                  <div className="font-mono text-foreground">${positionCalc.riskAmount}</div>
                </div>
              </div>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <Alert className="border-loss bg-loss-subtle">
              <AlertDescription className="text-loss-foreground">
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
            disabled={!positionCalc || errors.length > 0}
          >
            Create Trade Plan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};