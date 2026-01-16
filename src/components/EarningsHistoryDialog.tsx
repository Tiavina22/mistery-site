import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, TrendingUp, Calendar, AlertCircle, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mistery.pro';

interface Earning {
  id: number;
  month: number;
  year: number;
  totalViews: number;
  platformTotalViews: number;
  viewPercentage: number;
  totalSubscribers: number;
  grossRevenue: number;
  netRevenue: number;
  totalCreatorPool: number;
  grossEarning: number;
  previousCumul: number;
  totalEarning: number;
  paidAmount: number;
  carriedForward: number;
  status: string;
  calculationDate: string;
}

interface EarningsHistoryDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function EarningsHistoryDialog({
  open,
  onClose,
}: EarningsHistoryDialogProps) {
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authorToken');

      // Fetch earnings
      const earningsResponse = await fetch(`${API_BASE_URL}/api/wallet/earnings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const earningsData = await earningsResponse.json();

      // Fetch withdrawals
      const withdrawalsResponse = await fetch(`${API_BASE_URL}/api/wallet/withdrawals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const withdrawalsData = await withdrawalsResponse.json();

      setEarnings(earningsData.earnings || []);
      setWithdrawals(withdrawalsData.withdrawals || []);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    } finally {
      setLoading(false);
    }
  };

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
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
    ];
    return months[month - 1];
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; class: string }> = {
      pending: { label: 'En attente', class: 'bg-gray-100 text-gray-700' },
      processing: { label: 'En cours', class: 'bg-blue-100 text-blue-700' },
      completed: { label: 'Complété', class: 'bg-green-100 text-green-700' },
      rejected: { label: 'Rejeté', class: 'bg-red-100 text-red-700' },
      failed: { label: 'Échoué', class: 'bg-red-100 text-red-700' },
      calculated: { label: 'Calculé', class: 'bg-purple-100 text-purple-700' },
      paid: { label: 'Payé', class: 'bg-green-100 text-green-700' },
      carried_forward: { label: 'Reporté', class: 'bg-orange-100 text-orange-700' },
    };
    const config = variants[status] || variants.pending;
    return (
      <Badge className={config.class} variant="outline">
        {config.label}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Historique complet</DialogTitle>
          <DialogDescription>
            Consultez tous vos gains et retraits
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <Tabs defaultValue="earnings" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="earnings">
                Gains ({earnings.length})
              </TabsTrigger>
              <TabsTrigger value="withdrawals">
                Retraits ({withdrawals.length})
              </TabsTrigger>
            </TabsList>

            {/* Onglet Gains */}
            <TabsContent value="earnings" className="space-y-4">
              {earnings.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Aucun gain enregistré
                  </AlertDescription>
                </Alert>
              ) : (
                earnings.map((earning) => (
                  <Card key={earning.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        {/* En-tête */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold">
                              {getMonthName(earning.month)} {earning.year}
                            </span>
                          </div>
                          {getStatusBadge(earning.status)}
                        </div>

                        <Separator />

                        {/* Statistiques */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                              <Eye className="w-3 h-3" />
                              <span>Vues</span>
                            </div>
                            <div className="font-semibold">
                              {earning.totalViews.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {earning.viewPercentage.toFixed(2)}% du total ({earning.platformTotalViews.toLocaleString()})
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                              <TrendingUp className="w-3 h-3" />
                              <span>Gain</span>
                            </div>
                            <div className="font-semibold text-green-600">
                              {formatCurrency(earning.grossEarning)}
                            </div>
                            {earning.previousCumul > 0 && (
                              <div className="text-xs text-muted-foreground">
                                + {formatCurrency(earning.previousCumul)} (cumul)
                              </div>
                            )}
                          </div>
                        </div>

                        <Separator />

                        {/* Total */}
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-sm font-medium">Total</span>
                          <span className="text-lg font-bold text-purple-600">
                            {formatCurrency(earning.totalEarning)}
                          </span>
                        </div>

                        {/* Statut paiement */}
                        {earning.paidAmount > 0 ? (
                          <Alert className="bg-green-50 border-green-200">
                            <AlertDescription className="text-sm text-green-700">
                              ✓ Payé: {formatCurrency(earning.paidAmount)}
                            </AlertDescription>
                          </Alert>
                        ) : (
                          <Alert className="bg-orange-50 border-orange-200">
                            <AlertDescription className="text-sm text-orange-700">
                              ⏳ Reporté au mois suivant: {formatCurrency(earning.carriedForward)}
                              <div className="text-xs mt-1">
                                (seuil minimum non atteint)
                              </div>
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* Détails plateforme */}
                        <details className="text-xs text-muted-foreground">
                          <summary className="cursor-pointer hover:text-foreground">
                            Voir les détails de la plateforme
                          </summary>
                          <div className="mt-2 space-y-1 pl-4">
                            <div>Abonnés actifs: {earning.totalSubscribers}</div>
                            <div>CA brut: {formatCurrency(earning.grossRevenue)}</div>
                            <div>Résultat net: {formatCurrency(earning.netRevenue)}</div>
                            <div>Budget créateurs: {formatCurrency(earning.totalCreatorPool)}</div>
                          </div>
                        </details>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Onglet Retraits */}
            <TabsContent value="withdrawals" className="space-y-4">
              {withdrawals.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Aucun retrait effectué
                  </AlertDescription>
                </Alert>
              ) : (
                withdrawals.map((withdrawal) => (
                  <Card key={withdrawal.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">
                              {formatCurrency(withdrawal.amountRequested)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {withdrawal.withdrawalMethod.replace('_', ' ')}
                            </div>
                          </div>
                          {getStatusBadge(withdrawal.status)}
                        </div>

                        <Separator />

                        <div className="space-y-1 text-sm">
                          {withdrawal.transferFees > 0 && (
                            <div className="flex justify-between text-muted-foreground">
                              <span>Frais:</span>
                              <span>- {formatCurrency(withdrawal.transferFees)}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-semibold text-green-600">
                            <span>Reçu:</span>
                            <span>{formatCurrency(withdrawal.amountReceived)}</span>
                          </div>
                        </div>

                        {withdrawal.transactionReference && (
                          <div className="text-xs text-muted-foreground">
                            Réf: {withdrawal.transactionReference}
                          </div>
                        )}

                        {withdrawal.rejectionReason && (
                          <Alert variant="destructive" className="text-xs">
                            <AlertDescription>
                              {withdrawal.rejectionReason}
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className="text-xs text-muted-foreground">
                          {new Date(withdrawal.createdAt).toLocaleString('fr-FR')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
