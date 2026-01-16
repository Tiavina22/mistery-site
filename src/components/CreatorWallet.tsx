import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Wallet as WalletIcon,
  TrendingUp,
  TrendingDown,
  Download,
  History,
  AlertCircle,
  Eye,
  Calendar,
  DollarSign,
  Loader2,
} from 'lucide-react';
import WithdrawDialog from './WithdrawDialog';
import EarningsHistoryDialog from './EarningsHistoryDialog';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mistery.pro';

interface WalletData {
  wallet: {
    currentBalance: number;
    totalEarned: number;
    totalWithdrawn: number;
    pendingAmount: number;
    lastWithdrawalDate: string | null;
    canWithdraw: boolean;
  };
  realtimeEarnings: {
    completions: number;
    totalCompletions: number;
    completionPercentage: number;
    grossEarning: number;
    platform: {
      grossRevenue: number;
      netRevenue: number;
      totalCreatorPool: number;
    };
  };
  pendingWithdrawals: number;
}

export default function CreatorWallet() {
  const { author, token } = useAuth();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/wallet`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erreur de chargement');

      const data = await response.json();
      setWalletData(data);
    } catch (error) {
      console.error('Erreur wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (author && token) {
      fetchWallet();
    }
  }, [author, token]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('mg-MG', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' Ar';
  };

  const getMonthName = (month: number) => {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[month - 1];
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: 'En attente', variant: 'secondary' },
      calculated: { label: 'Calculé', variant: 'default' },
      paid: { label: 'Payé', variant: 'default' },
      carried_forward: { label: 'Reporté', variant: 'outline' },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!walletData) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Impossible de charger votre portefeuille. Veuillez réessayer.
        </AlertDescription>
      </Alert>
    );
  }

  const { wallet, realtimeEarnings, pendingWithdrawals } = walletData;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mon Portefeuille</h2>
          <p className="text-muted-foreground">
            Gains en temps réel basés sur les lectures complètes
          </p>
        </div>
      </div>

      {/* Stats en temps réel */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/90">Lectures complètes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{realtimeEarnings.completions}</div>
            <p className="text-xs text-white/70 mt-1">
              {realtimeEarnings.completionPercentage.toFixed(2)}% du total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/90">Gains temps réel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(realtimeEarnings.grossEarning)}</div>
            <p className="text-xs text-white/70 mt-1">
              Basé sur lectures complètes
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/90">Pool créateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(realtimeEarnings.platform.totalCreatorPool)}</div>
            <p className="text-xs text-white/70 mt-1">
              Total disponible
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-700 text-white border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/90">Revenu plateforme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(realtimeEarnings.platform.netRevenue)}</div>
            <p className="text-xs text-white/70 mt-1">
              Revenu net total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Balance principale */}
      <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <WalletIcon className="w-5 h-5" />
            Solde disponible
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-5xl font-bold">
              {formatCurrency(wallet.currentBalance)}
            </div>
            
            {wallet.pendingAmount > 0 && (
              <div className="flex items-center gap-2 text-purple-100">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">
                  {formatCurrency(wallet.pendingAmount)} en attente de traitement
                </span>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setWithdrawDialogOpen(true)}
                disabled={!wallet.canWithdraw || pendingWithdrawals > 0}
                className="bg-white text-purple-700 hover:bg-purple-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Retirer
              </Button>
              <Button
                onClick={() => setHistoryDialogOpen(true)}
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10"
              >
                <History className="w-4 h-4 mr-2" />
                Historique
              </Button>
            </div>

            {!wallet.canWithdraw && (
              <Alert className="bg-white/10 border-white/20 text-white">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-white">
                  Le solde minimum pour retirer est de 10 000 Ar
                </AlertDescription>
              </Alert>
            )}

            {pendingWithdrawals > 0 && (
              <Alert className="bg-white/10 border-white/20 text-white">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-white">
                  Vous avez {pendingWithdrawals} demande(s) en cours de traitement
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total gagné
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(wallet.totalEarned)}
            </div>
            <p className="text-xs text-muted-foreground">
              Depuis la création
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total retiré
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(wallet.totalWithdrawn)}
            </div>
            <p className="text-xs text-muted-foreground">
              {wallet.lastWithdrawalDate
                ? `Dernier: ${new Date(wallet.lastWithdrawalDate).toLocaleDateString('fr-FR')}`
                : 'Aucun retrait'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              En attente
            </CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(wallet.pendingAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingWithdrawals} demande(s)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <WithdrawDialog
        open={withdrawDialogOpen}
        onClose={() => setWithdrawDialogOpen(false)}
        currentBalance={wallet.currentBalance}
        onSuccess={fetchWallet}
        token={token || ''}
      />

      <EarningsHistoryDialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        token={token || ''}
      />
    </div>
  );
}
