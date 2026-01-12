import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  DollarSign, 
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface Payment {
  id: number;
  reference: string;
  reference_vpi: string | null;
  amount: number;
  currency: string;
  etat: string;
  panier: string | null;
  initiateur: string | null;
  reference_mm: string | null;
  subscription_id: number | null;
  created_at: string;
  updated_at: string;
  user_id: number;
  username: string;
  email: string;
  avatar: string | null;
  offer_name: string | null;
  duration_months: number | null;
}

interface Stats {
  total_payments: number;
  successful_payments: number;
  pending_payments: number;
  failed_payments: number;
  total_revenue: number;
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { token } = useAdmin();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500';

  const fetchPayments = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      
      if (search) params.append('search', search);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`${API_URL}/api/admin/payments?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setPayments(data.data.payments);
        setStats(data.data.stats);
        setTotalPages(data.data.pagination.totalPages);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les paiements',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [token, page, statusFilter]);

  const handleSearch = () => {
    setPage(1);
    fetchPayments();
  };

  const handleDateFilter = () => {
    setPage(1);
    fetchPayments();
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle2 className="w-3 h-3 mr-1" /> Réussi</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" /> En attente</Badge>;
      case 'FAILED':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="w-3 h-3 mr-1" /> Échoué</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + ' Ar';
  };

  const openDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setDetailsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Paiements</h1>
            <p className="text-muted-foreground">Historique des transactions</p>
          </div>
          <Button onClick={fetchPayments} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total transactions</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total_payments}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Réussis</p>
                  <p className="text-2xl font-bold text-green-400">{stats.successful_payments}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">En attente</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.pending_payments}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Échoués</p>
                  <p className="text-2xl font-bold text-red-400">{stats.failed_payments}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenu total</p>
                  <p className="text-xl font-bold text-purple-400">{formatCurrency(stats.total_revenue)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher par utilisateur, email, référence..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 bg-background"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setPage(1); }}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="SUCCESS">Réussi</SelectItem>
                <SelectItem value="PENDING">En attente</SelectItem>
                <SelectItem value="FAILED">Échoué</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Label className="text-muted-foreground whitespace-nowrap">Du</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-[150px] bg-background"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-muted-foreground whitespace-nowrap">Au</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-[150px] bg-background"
              />
            </div>

            <Button onClick={handleDateFilter} variant="secondary">
              <Calendar className="w-4 h-4 mr-2" />
              Filtrer
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Utilisateur</TableHead>
                <TableHead className="text-muted-foreground">Référence</TableHead>
                <TableHead className="text-muted-foreground">Offre</TableHead>
                <TableHead className="text-muted-foreground">Montant</TableHead>
                <TableHead className="text-muted-foreground">Statut</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Aucun paiement trouvé
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                          {payment.avatar ? (
                            <img src={payment.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-medium text-primary">
                              {payment.username?.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{payment.username}</p>
                          <p className="text-xs text-muted-foreground">{payment.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {payment.reference?.substring(0, 15)}...
                      </code>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {payment.offer_name || '-'}
                      {payment.duration_months && (
                        <span className="text-xs text-muted-foreground ml-1">
                          ({payment.duration_months} mois)
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.etat)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(payment.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDetails(payment)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} sur {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Details Dialog */}
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Détails du paiement</DialogTitle>
              <DialogDescription>
                Informations complètes sur la transaction
              </DialogDescription>
            </DialogHeader>
            {selectedPayment && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Utilisateur</Label>
                    <p className="font-medium">{selectedPayment.username}</p>
                    <p className="text-sm text-muted-foreground">{selectedPayment.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Statut</Label>
                    <div className="mt-1">{getStatusBadge(selectedPayment.etat)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Montant</Label>
                    <p className="text-xl font-bold text-primary">{formatCurrency(selectedPayment.amount)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Offre</Label>
                    <p className="font-medium">{selectedPayment.offer_name || 'Non spécifiée'}</p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between">
                    <Label className="text-muted-foreground">Référence</Label>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{selectedPayment.reference}</code>
                  </div>
                  {selectedPayment.reference_vpi && (
                    <div className="flex justify-between">
                      <Label className="text-muted-foreground">Réf. VPI</Label>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{selectedPayment.reference_vpi}</code>
                    </div>
                  )}
                  {selectedPayment.reference_mm && (
                    <div className="flex justify-between">
                      <Label className="text-muted-foreground">Réf. Mobile Money</Label>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{selectedPayment.reference_mm}</code>
                    </div>
                  )}
                  {selectedPayment.initiateur && (
                    <div className="flex justify-between">
                      <Label className="text-muted-foreground">Initiateur</Label>
                      <span className="text-sm">{selectedPayment.initiateur}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between">
                    <Label className="text-muted-foreground">Créé le</Label>
                    <span className="text-sm">{formatDate(selectedPayment.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <Label className="text-muted-foreground">Mis à jour le</Label>
                    <span className="text-sm">{formatDate(selectedPayment.updated_at)}</span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
