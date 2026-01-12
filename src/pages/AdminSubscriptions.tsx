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
  DialogFooter,
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
  Crown, 
  Users, 
  Calendar,
  Gift,
  XCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

interface Subscription {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  is_premium: boolean;
  premium: boolean;
  subscription_type: string | null;
  subscription_status: string | null;
  subscription_expires_at: string | null;
  created_at: string;
  country?: {
    id: number;
    name: string;
    code: string;
  };
}

interface Stats {
  total: number;
  active_premium: number;
  active_subscriptions: number;
  expired_subscriptions: number;
  expiring_soon: number;
}

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<Subscription | null>(null);
  const [grantDialogOpen, setGrantDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [grantDays, setGrantDays] = useState('30');
  const { toast } = useToast();
  const { token } = useAdmin();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500';

  const fetchSubscriptions = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      
      if (search) params.append('search', search);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(`${API_URL}/api/admin/subscriptions?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setSubscriptions(data.data.subscriptions);
        setStats(data.data.stats);
        setTotalPages(data.data.pagination.totalPages);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les souscriptions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [token, page, statusFilter]);

  const handleSearch = () => {
    setPage(1);
    fetchSubscriptions();
  };

  const handleGrantPremium = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/subscriptions/${selectedUser.id}/grant-premium`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          duration_days: parseInt(grantDays),
          subscription_type: 'gift'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Succès',
          description: `Premium accordé pour ${grantDays} jours`,
        });
        setGrantDialogOpen(false);
        fetchSubscriptions();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Impossible d'accorder le premium",
        variant: 'destructive',
      });
    }
  };

  const handleRevokeSubscription = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/subscriptions/${selectedUser.id}/revoke`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Succès',
          description: 'Souscription révoquée',
        });
        setRevokeDialogOpen(false);
        fetchSubscriptions();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de révoquer la souscription',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (sub: Subscription) => {
    if (!sub.is_premium && !sub.subscription_status) {
      return <Badge variant="secondary">Free</Badge>;
    }
    
    if (sub.subscription_status === 'active') {
      const expiresAt = sub.subscription_expires_at ? new Date(sub.subscription_expires_at) : null;
      const now = new Date();
      
      if (expiresAt && expiresAt < now) {
        return <Badge variant="destructive">Expiré</Badge>;
      }
      
      // Vérifier si expire dans les 7 jours
      if (expiresAt) {
        const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilExpiry <= 7) {
          return <Badge className="bg-orange-500">Expire bientôt</Badge>;
        }
      }
      
      return <Badge className="bg-green-500">Actif</Badge>;
    }
    
    if (sub.subscription_status === 'expired') {
      return <Badge variant="destructive">Expiré</Badge>;
    }
    
    if (sub.subscription_status === 'revoked') {
      return <Badge variant="outline" className="text-red-500 border-red-500">Révoqué</Badge>;
    }
    
    return <Badge variant="secondary">{sub.subscription_status || 'Inconnu'}</Badge>;
  };

  const getTypeBadge = (type: string | null) => {
    if (!type) return null;
    
    const typeColors: Record<string, string> = {
      'gift': 'bg-purple-500',
      'monthly': 'bg-blue-500',
      'annual': 'bg-indigo-500',
      'lifetime': 'bg-yellow-500',
    };
    
    return (
      <Badge className={typeColors[type] || 'bg-gray-500'}>
        {type === 'gift' ? 'Cadeau' : type}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Crown className="w-7 h-7 text-yellow-500" />
              Souscriptions Premium
            </h1>
            <p className="text-muted-foreground">Gérer les abonnements premium des utilisateurs</p>
          </div>
          <Button onClick={fetchSubscriptions} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="w-4 h-4" />
                <span className="text-sm">Total</span>
              </div>
              <p className="text-2xl font-bold">{stats.total || 0}</p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-500 mb-1">
                <Crown className="w-4 h-4" />
                <span className="text-sm">Premium Actifs</span>
              </div>
              <p className="text-2xl font-bold text-green-500">{stats.active_premium || 0}</p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-500 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Souscriptions Actives</span>
              </div>
              <p className="text-2xl font-bold text-blue-500">{stats.active_subscriptions || 0}</p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-500 mb-1">
                <XCircle className="w-4 h-4" />
                <span className="text-sm">Expirées</span>
              </div>
              <p className="text-2xl font-bold text-red-500">{stats.expired_subscriptions || 0}</p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 text-orange-500 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">Expirent Bientôt</span>
              </div>
              <p className="text-2xl font-bold text-orange-500">{stats.expiring_soon || 0}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Rechercher par email ou username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="max-w-md"
            />
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4" />
            </Button>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Actifs</SelectItem>
              <SelectItem value="expired">Expirés</SelectItem>
              <SelectItem value="revoked">Révoqués</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Pays</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Expire le</TableHead>
                <TableHead>Inscrit le</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : subscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Aucune souscription trouvée
                  </TableCell>
                </TableRow>
              ) : (
                subscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                          {sub.avatar ? (
                            <img src={sub.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg font-semibold">
                              {sub.username?.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{sub.username}</p>
                          <p className="text-sm text-muted-foreground">{sub.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {sub.country ? (
                        <span>{sub.country.name}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(sub)}</TableCell>
                    <TableCell>{getTypeBadge(sub.subscription_type)}</TableCell>
                    <TableCell>{formatDate(sub.subscription_expires_at)}</TableCell>
                    <TableCell>{formatDate(sub.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(sub);
                            setGrantDialogOpen(true);
                          }}
                        >
                          <Gift className="w-4 h-4 mr-1" />
                          Offrir
                        </Button>
                        {sub.is_premium && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedUser(sub);
                              setRevokeDialogOpen(true);
                            }}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Révoquer
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="flex items-center px-4">
              Page {page} sur {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Grant Premium Dialog */}
        <Dialog open={grantDialogOpen} onOpenChange={setGrantDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Offrir Premium</DialogTitle>
              <DialogDescription>
                Accorder un abonnement premium gratuit à {selectedUser?.username}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Durée (jours)</Label>
                <Select value={grantDays} onValueChange={setGrantDays}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 jours</SelectItem>
                    <SelectItem value="14">14 jours</SelectItem>
                    <SelectItem value="30">30 jours (1 mois)</SelectItem>
                    <SelectItem value="90">90 jours (3 mois)</SelectItem>
                    <SelectItem value="180">180 jours (6 mois)</SelectItem>
                    <SelectItem value="365">365 jours (1 an)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setGrantDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleGrantPremium}>
                <Gift className="w-4 h-4 mr-2" />
                Offrir Premium
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Revoke Dialog */}
        <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Révoquer la souscription</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir révoquer la souscription premium de {selectedUser?.username} ?
                Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRevokeDialogOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleRevokeSubscription}>
                <XCircle className="w-4 h-4 mr-2" />
                Révoquer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
