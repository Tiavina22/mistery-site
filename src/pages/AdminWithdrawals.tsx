import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  User,
  Smartphone,
  Calendar,
  AlertCircle,
  Search,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mistery.pro';

interface WithdrawalRequest {
  id: number;
  author_id: number;
  amount_requested: number;
  withdrawal_method: string;
  withdrawal_details: any;
  transfer_fees: number;
  amount_received: number;
  status: string;
  transaction_reference: string | null;
  rejection_reason: string | null;
  processed_at: string | null;
  created_at: string;
  author: {
    id: number;
    pseudo: string;
    name: string;
    email: string;
  };
}

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [transactionRef, setTransactionRef] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/admin/withdrawals`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (!response.ok) throw new Error('Erreur chargement');

      const data = await response.json();
      setWithdrawals(data.withdrawals || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedWithdrawal) return;

    try {
      setActionLoading(true);
      
      const endpoint =
        actionType === 'approve'
          ? `${API_BASE_URL}/api/admin/withdrawals/${selectedWithdrawal.id}/approve`
          : `${API_BASE_URL}/api/admin/withdrawals/${selectedWithdrawal.id}/reject`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({
          transactionReference: transactionRef,
          rejectionReason: rejectionReason,
        }),
      });

      if (!response.ok) throw new Error('Erreur action');

      // Refresh
      await fetchWithdrawals();
      setActionDialogOpen(false);
      setSelectedWithdrawal(null);
      setTransactionRef('');
      setRejectionReason('');
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const openActionDialog = (withdrawal: WithdrawalRequest, type: 'approve' | 'reject') => {
    setSelectedWithdrawal(withdrawal);
    setActionType(type);
    setActionDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('mg-MG', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' Ar';
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; icon: any; class: string }> = {
      pending: { label: 'En attente', icon: Clock, class: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
      processing: { label: 'En cours', icon: Loader2, class: 'bg-blue-100 text-blue-700 border-blue-300' },
      completed: { label: 'Complété', icon: CheckCircle2, class: 'bg-green-100 text-green-700 border-green-300' },
      rejected: { label: 'Rejeté', icon: XCircle, class: 'bg-red-100 text-red-700 border-red-300' },
      failed: { label: 'Échoué', icon: XCircle, class: 'bg-red-100 text-red-700 border-red-300' },
    };
    return configs[status] || configs.pending;
  };

  const filteredWithdrawals = withdrawals.filter((w) => {
    const matchesStatus = selectedStatus === 'all' || w.status === selectedStatus;
    const matchesSearch =
      !searchQuery ||
      w.author.pseudo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.author.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.id.toString().includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: withdrawals.length,
    pending: withdrawals.filter((w) => w.status === 'pending').length,
    completed: withdrawals.filter((w) => w.status === 'completed').length,
    rejected: withdrawals.filter((w) => w.status === 'rejected').length,
    totalAmount: withdrawals
      .filter((w) => w.status === 'pending')
      .reduce((sum, w) => sum + w.amount_requested, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Demandes de retrait</h2>
        <p className="text-muted-foreground">
          Gérez les demandes de retrait des créateurs
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(stats.totalAmount)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complétés</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejetés</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, email ou ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="processing">En cours</SelectItem>
                <SelectItem value="completed">Complétés</SelectItem>
                <SelectItem value="rejected">Rejetés</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste */}
      <Card>
        <CardHeader>
          <CardTitle>Demandes ({filteredWithdrawals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredWithdrawals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>Aucune demande trouvée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredWithdrawals.map((withdrawal) => {
                const statusConfig = getStatusConfig(withdrawal.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={withdrawal.id}
                    className="border rounded-lg p-4 hover:bg-accent/50 transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold">
                            {withdrawal.author.pseudo || withdrawal.author.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            #{withdrawal.id}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {withdrawal.author.email}
                        </div>
                      </div>
                      <Badge className={statusConfig.class} variant="outline">
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <div className="text-muted-foreground">Montant demandé</div>
                        <div className="font-bold text-lg">
                          {formatCurrency(withdrawal.amount_requested)}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Frais</div>
                        <div className="font-semibold text-red-600">
                          - {formatCurrency(withdrawal.transfer_fees)}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Montant reçu</div>
                        <div className="font-semibold text-green-600">
                          {formatCurrency(withdrawal.amount_received)}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground flex items-center gap-1">
                          <Smartphone className="w-3 h-3" />
                          Méthode
                        </div>
                        <div className="font-semibold capitalize">
                          {withdrawal.withdrawal_method.replace('_', ' ')}
                        </div>
                      </div>
                    </div>

                    {withdrawal.withdrawal_details?.phoneNumber && (
                      <div className="text-sm mb-3">
                        <span className="text-muted-foreground">Téléphone: </span>
                        <span className="font-mono">{withdrawal.withdrawal_details.phoneNumber}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Demandé le {new Date(withdrawal.created_at).toLocaleString('fr-FR')}
                      </span>
                    </div>

                    {withdrawal.transaction_reference && (
                      <Alert className="mb-3">
                        <AlertDescription className="text-xs">
                          Référence: {withdrawal.transaction_reference}
                        </AlertDescription>
                      </Alert>
                    )}

                    {withdrawal.rejection_reason && (
                      <Alert variant="destructive" className="mb-3">
                        <AlertDescription className="text-xs">
                          Raison du rejet: {withdrawal.rejection_reason}
                        </AlertDescription>
                      </Alert>
                    )}

                    {withdrawal.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => openActionDialog(withdrawal, 'approve')}
                          className="flex-1"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Approuver
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openActionDialog(withdrawal, 'reject')}
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Rejeter
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog Action */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approuver le retrait' : 'Rejeter le retrait'}
            </DialogTitle>
            <DialogDescription>
              {selectedWithdrawal && (
                <>
                  Créateur: {selectedWithdrawal.author.pseudo} <br />
                  Montant: {formatCurrency(selectedWithdrawal.amount_requested)}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {actionType === 'approve' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="transactionRef">Référence de transaction</Label>
                  <Input
                    id="transactionRef"
                    placeholder="Ex: TXN123456789"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Référence du paiement MVola/Orange Money/Airtel
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="rejectionReason">Raison du rejet</Label>
                  <Textarea
                    id="rejectionReason"
                    placeholder="Expliquez pourquoi ce retrait est rejeté..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialogOpen(false)}
              disabled={actionLoading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleAction}
              disabled={
                actionLoading ||
                (actionType === 'approve' && !transactionRef) ||
                (actionType === 'reject' && !rejectionReason)
              }
              variant={actionType === 'reject' ? 'destructive' : 'default'}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Traitement...
                </>
              ) : (
                'Confirmer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
