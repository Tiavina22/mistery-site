import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Clock, Wallet, Mail, Phone, User, Calendar } from 'lucide-react';

interface PaymentMethod {
  id: number;
  author_id: number;
  provider_id: number;
  phone_number: string;
  account_holder_name: string;
  is_primary: boolean;
  is_verified: boolean;
  rejection_reason?: string;
  verified_at?: string;
  created_at: string;
  author: {
    id: number;
    email: string;
    pseudo: string;
    phone_number?: string;
  };
  provider: {
    id: number;
    name: string;
    code: string;
    logo?: string;
  };
}

export default function AdminPaymentMethods() {
  const { token } = useAdmin();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    loadPaymentMethods();
  }, [pagination.page, statusFilter]);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        status: statusFilter
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/payment-methods?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      if (data.success) {
        setPaymentMethods(data.data.paymentMethods);
        setPagination(prev => ({
          ...prev,
          total: data.data.pagination.total,
          totalPages: data.data.pagination.totalPages
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des moyens de paiement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!selectedMethod) return;
    if (action === 'reject' && !rejectionReason.trim()) {
      alert('Veuillez indiquer la raison du rejet');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/payment-methods/${selectedMethod.id}/validate`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action,
            rejection_reason: rejectionReason
          })
        }
      );

      const data = await response.json();
      if (data.success) {
        setShowDialog(false);
        setSelectedMethod(null);
        setRejectionReason('');
        loadPaymentMethods();
      }
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (method: PaymentMethod) => {
    if (method.is_verified) {
      return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Vérifié</Badge>;
    } else if (method.rejection_reason) {
      return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" /> Rejeté</Badge>;
    } else {
      return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" /> En attente</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">En Attente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-500">
                {paymentMethods.filter(m => !m.is_verified && !m.rejection_reason).length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Vérifiés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">
                {paymentMethods.filter(m => m.is_verified).length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rejetés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-500">
                {paymentMethods.filter(m => m.rejection_reason).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des moyens de paiement */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Validation des moyens de paiement</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Vérifiez et validez les comptes mobile money des créateurs
                </CardDescription>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-secondary text-foreground border-none rounded-md"
              >
                <option value="">Tous</option>
                <option value="pending">En attente</option>
                <option value="verified">Vérifiés</option>
                <option value="rejected">Rejetés</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8 text-muted-foreground">Chargement...</p>
            ) : paymentMethods.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">Aucun moyen de paiement trouvé</p>
            ) : (
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="border border-border rounded-lg p-4 hover:bg-secondary/50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{method.author.pseudo}</h3>
                          {getStatusBadge(method)}
                          {method.is_primary && (
                            <Badge className="bg-blue-500">Principal</Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{method.author.email}</span>
                          </div>
                          {method.author.phone_number && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{method.author.phone_number}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Ajouté le {new Date(method.created_at).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        {method.provider.logo && (
                          <img 
                            src={method.provider.logo} 
                            alt={method.provider.name}
                            className="w-12 h-12 object-contain"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{method.provider.name}</p>
                          <p className="text-xs text-muted-foreground">{method.provider.code}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Numéro de téléphone</p>
                          <p className="font-mono font-semibold text-foreground">{method.phone_number}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Titulaire du compte</p>
                          <p className="font-semibold text-foreground">{method.account_holder_name}</p>
                        </div>
                      </div>

                      {!method.is_verified && !method.rejection_reason && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 flex-1"
                            onClick={() => {
                              setSelectedMethod(method);
                              setAction('approve');
                              setShowDialog(true);
                            }}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Valider
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 flex-1"
                            onClick={() => {
                              setSelectedMethod(method);
                              setAction('reject');
                              setShowDialog(true);
                            }}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Rejeter
                          </Button>
                        </div>
                      )}

                      {method.rejection_reason && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded p-3 mt-2">
                          <p className="text-xs text-red-400">
                            <strong>Raison du rejet:</strong> {method.rejection_reason}
                          </p>
                        </div>
                      )}

                      {method.is_verified && method.verified_at && (
                        <div className="bg-green-500/10 border border-green-500/50 rounded p-3 mt-2">
                          <p className="text-xs text-green-400">
                            ✓ Vérifié le {new Date(method.verified_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Page {pagination.page} sur {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={pagination.page === 1}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog Validation */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {action === 'approve' ? 'Valider le moyen de paiement' : 'Rejeter le moyen de paiement'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {action === 'approve'
                ? 'Êtes-vous sûr que ce compte mobile money est correct ?'
                : 'Veuillez indiquer la raison du rejet'}
            </DialogDescription>
          </DialogHeader>

          {action === 'reject' && (
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-foreground">Raison du rejet *</Label>
              <Textarea
                id="reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Ex: Numéro invalide, nom ne correspond pas, compte inexistant..."
                className="bg-secondary border-none text-foreground min-h-[100px]"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              onClick={handleValidate}
              className={`flex-1 ${action === 'approve' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Traitement...' : 'Confirmer'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
