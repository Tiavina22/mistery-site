import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Settings,
  DollarSign,
  TrendingUp,
  Users,
  Eye,
  Loader2,
  Plus,
  Check,
  Clock,
  AlertCircle,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mistery.pro';

export default function AdminPlatformFees() {
  const { token } = useAdmin();
  const [activeFees, setActiveFees] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    payment_gateway_fee_percentage: 2.5,
    payment_gateway_fixed_fee: 0,
    operational_cost_percentage: 10,
    creator_share_percentage: 40,
    platform_share_percentage: 60,
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Récupérer config active
      const feesRes = await fetch(`${API_BASE_URL}/api/admin/platform-fees/active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (feesRes.ok) {
        const data = await feesRes.json();
        setActiveFees(data.fees);
      }

      // Récupérer stats
      const statsRes = await fetch(`${API_BASE_URL}/api/admin/platform-fees/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }

      // Récupérer historique
      const historyRes = await fetch(`${API_BASE_URL}/api/admin/platform-fees/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (historyRes.ok) {
        const data = await historyRes.json();
        setHistory(data.history);
      }
    } catch (error) {
      console.error('Erreur fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/platform-fees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setCreateDialogOpen(false);
        fetchData();
      }
    } catch (error) {
      console.error('Erreur création:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('mg-MG', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' Ar';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Frais & Répartition</h1>
          <p className="text-muted-foreground">Configuration des frais de plateforme et répartition des revenus</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle config
        </Button>
      </div>

      {/* Stats Dashboard */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Revenu brut</CardDescription>
              <CardTitle className="text-2xl">{formatCurrency(stats.platform.grossRevenue)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {stats.platform.transactionCount} transactions
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Revenu net</CardDescription>
              <CardTitle className="text-2xl text-green-600">{formatCurrency(stats.platform.netRevenue)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Après frais: {formatCurrency(stats.platform.paymentFees + stats.platform.operationalCosts)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pool créateurs</CardDescription>
              <CardTitle className="text-2xl text-purple-600">{formatCurrency(stats.platform.totalCreatorPool)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {activeFees?.creator_share_percentage}% du revenu net
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Lectures complètes</CardDescription>
              <CardTitle className="text-2xl">{stats.completions.total}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {stats.completions.byCreator} créateurs actifs
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Configuration active */}
      {activeFees && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuration active
                </CardTitle>
                <CardDescription>En vigueur depuis le {new Date(activeFees.effective_date).toLocaleDateString()}</CardDescription>
              </div>
              <Badge variant="default" className="bg-green-600">
                <Check className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Frais passerelle (%)</div>
                <div className="text-2xl font-bold">{activeFees.payment_gateway_fee_percentage}%</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Frais fixes</div>
                <div className="text-2xl font-bold">{formatCurrency(activeFees.payment_gateway_fixed_fee)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Coûts opérationnels</div>
                <div className="text-2xl font-bold">{activeFees.operational_cost_percentage}%</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Part créateurs</div>
                <div className="text-2xl font-bold text-purple-600">{activeFees.creator_share_percentage}%</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Part plateforme</div>
                <div className="text-2xl font-bold text-blue-600">{activeFees.platform_share_percentage}%</div>
              </div>
            </div>

            {activeFees.notes && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{activeFees.notes}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Top créateurs */}
      {stats?.topCreators && stats.topCreators.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Top 10 créateurs
            </CardTitle>
            <CardDescription>Classement par nombre de lectures complètes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topCreators.map((creator: any, index: number) => (
                <div key={creator.authorId} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{creator.pseudo}</div>
                      <div className="text-sm text-muted-foreground">
                        {creator.completions} lectures • {creator.completionPercentage.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{formatCurrency(creator.grossEarning)}</div>
                    <div className="text-xs text-muted-foreground">Gains temps réel</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historique */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Historique des configurations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {history.map((config) => (
              <div
                key={config.id}
                className={`p-4 rounded-lg border ${config.is_active ? 'border-green-500 bg-green-50' : 'border-border'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">
                    {new Date(config.effective_date).toLocaleDateString()}
                  </div>
                  {config.is_active && (
                    <Badge variant="default" className="bg-green-600">Active</Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground grid grid-cols-3 gap-2">
                  <div>Créateurs: {config.creator_share_percentage}%</div>
                  <div>Plateforme: {config.platform_share_percentage}%</div>
                  <div>Coûts op: {config.operational_cost_percentage}%</div>
                </div>
                {config.notes && (
                  <div className="text-sm text-muted-foreground mt-2">{config.notes}</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog création */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouvelle configuration</DialogTitle>
            <DialogDescription>
              Créer une nouvelle configuration de frais (désactivera l'actuelle)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Frais passerelle (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.payment_gateway_fee_percentage}
                  onChange={(e) => setFormData({ ...formData, payment_gateway_fee_percentage: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label>Frais fixes (Ar)</Label>
                <Input
                  type="number"
                  value={formData.payment_gateway_fixed_fee}
                  onChange={(e) => setFormData({ ...formData, payment_gateway_fixed_fee: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label>Coûts opérationnels (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.operational_cost_percentage}
                  onChange={(e) => setFormData({ ...formData, operational_cost_percentage: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label>Part créateurs (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.creator_share_percentage}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    setFormData({
                      ...formData,
                      creator_share_percentage: value,
                      platform_share_percentage: 100 - value,
                    });
                  }}
                />
              </div>
              <div>
                <Label>Part plateforme (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.platform_share_percentage}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    setFormData({
                      ...formData,
                      platform_share_percentage: value,
                      creator_share_percentage: 100 - value,
                    });
                  }}
                />
              </div>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Raison du changement, contexte..."
              />
            </div>

            {formData.creator_share_percentage + formData.platform_share_percentage !== 100 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  La somme des parts doit être égale à 100%
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleCreateFees}
              disabled={formData.creator_share_percentage + formData.platform_share_percentage !== 100}
            >
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </AdminLayout>
  );
}
