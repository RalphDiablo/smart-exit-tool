import { useState } from 'react';
import { TradeSetupForm } from '@/components/TradeSetupForm';
import { TradeDashboard } from '@/components/TradeDashboard';
import { EmotionalRules } from '@/components/EmotionalRules';
import { Trade, TradeSetup, TradeStatus } from '@/types/trade';
import { TrendingUp, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [currentTrade, setCurrentTrade] = useState<Trade | null>(null);

  const handleTradeSetup = (setup: TradeSetup) => {
    const newTrade: Trade = {
      ...setup,
      id: `trade_${Date.now()}`,
      status: {
        isActive: true,
        tp1Hit: false,
        tp2Hit: false,
        tp3Hit: false,
        currentSL: setup.stopLoss,
        trailingStopEnabled: false,
        trailingStopPercent: 3, // Default 3% trailing stop
      },
      createdAt: new Date(),
    };
    setCurrentTrade(newTrade);
  };

  const handleStatusUpdate = (statusUpdate: Partial<TradeStatus>) => {
    if (!currentTrade) return;
    
    setCurrentTrade(prev => prev ? {
      ...prev,
      status: { ...prev.status, ...statusUpdate }
    } : null);
  };

  const handleNewTrade = () => {
    setCurrentTrade(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">CryptoTrade Assistant</h1>
                <p className="text-sm text-muted-foreground">Disciplined profit-taking for crypto traders</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/funded-account"
                className="px-4 py-2 bg-gradient-profit text-white rounded-lg hover:bg-gradient-profit/90 transition-smooth flex items-center gap-2"
              >
                <DollarSign className="h-4 w-4" />
                Funded Account
              </Link>
              {currentTrade && (
                <button
                  onClick={handleNewTrade}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-smooth"
                >
                  New Trade
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Side - Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {!currentTrade ? (
              <TradeSetupForm onSubmit={handleTradeSetup} />
            ) : (
              <TradeDashboard 
                trade={currentTrade} 
                onUpdateStatus={handleStatusUpdate}
              />
            )}
          </div>

          {/* Right Side - Emotional Rules */}
          <div className="lg:col-span-1">
            <EmotionalRules />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
