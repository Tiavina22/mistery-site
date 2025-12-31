import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Clock, Eye, Mail, Phone, Calendar } from 'lucide-react';

interface KYCItem {
  id: number;
  author_id: number;
  cin_number: string;
  cin_recto: string;
  cin_verso: string;
  cin_selfie: string;
  status: 'en_verification' | 'valide' | 'rejete';
  rejection_reason?: string;
  created_at: string;
  author: {
    id: number;
    email: string;
    pseudo: string;
    phone_number?: string;
  };
}

export default function AdminKYC() {
  const { token } = useAdmin();
  const [kycList, setKycList] = useState<KYCItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKYC, setSelectedKYC] = useState<KYCItem | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [imageTitle, setImageTitle] = useState('');
  const [action, setAction] = useState<'valide' | 'rejete'>('valide');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('en_verification');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    loadKYC();
  }, [pagination.page, statusFilter]);

  const loadKYC = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        status: statusFilter
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/kyc?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      if (data.success) {
        setKycList(data.data.kycList);
        setPagination(prev => ({
          ...prev,
          total: data.data.pagination.total,
          totalPages: data.data.pagination.totalPages
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des KYC:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!selectedKYC) return;
    if (action === 'rejete' && !rejectionReason.trim()) {
      alert('Veuillez indiquer la raison du rejet');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/kyc/${selectedKYC.id}/validate`,
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
        setSelectedKYC(null);
        setRejectionReason('');
        loadKYC();
      }
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const viewImage = (imageData: string, title: string) => {
    setSelectedImage(imageData);
    setImageTitle(title);
    setShowImageDialog(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valide':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Validé</Badge>;
      case 'en_verification':
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" /> En attente</Badge>;
      case 'rejete':
        return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" /> Rejeté</Badge>;
      default:
        return null;
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
                {kycList.filter(k => k.status === 'en_verification').length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Validés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">
                {kycList.filter(k => k.status === 'valide').length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rejetés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-500">
                {kycList.filter(k => k.status === 'rejete').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des KYC */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Validation KYC</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Vérifiez et validez les documents d'identité des créateurs
                </CardDescription>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-secondary text-foreground border-none rounded-md"
              >
                <option value="">Tous</option>
                <option value="en_verification">En attente</option>
                <option value="valide">Validés</option>
                <option value="rejete">Rejetés</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8 text-muted-foreground">Chargement...</p>
            ) : kycList.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">Aucun KYC trouvé</p>
            ) : (
              <div className="space-y-4">
                {kycList.map((kyc) => (
                  <div key={kyc.id} className="border border-border rounded-lg p-4 hover:bg-secondary/50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{kyc.author.pseudo}</h3>
                          {getStatusBadge(kyc.status)}
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{kyc.author.email}</span>
                          </div>
                          {kyc.author.phone_number && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{kyc.author.phone_number}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Soumis le {new Date(kyc.created_at).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">
                        Numéro CIN: <span className="font-mono">{kyc.cin_number}</span>
                      </p>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewImage(kyc.cin_recto, 'CIN Recto')}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Voir Recto
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewImage(kyc.cin_verso, 'CIN Verso')}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Voir Verso
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewImage(kyc.cin_selfie, 'Selfie avec CIN')}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Voir Selfie
                        </Button>
                      </div>

                      {kyc.status === 'en_verification' && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 flex-1"
                            onClick={() => {
                              setSelectedKYC(kyc);
                              setAction('valide');
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
                              setSelectedKYC(kyc);
                              setAction('rejete');
                              setShowDialog(true);
                            }}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Rejeter
                          </Button>
                        </div>
                      )}

                      {kyc.status === 'rejete' && kyc.rejection_reason && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded p-2 mt-2">
                          <p className="text-xs text-red-400">
                            <strong>Raison du rejet:</strong> {kyc.rejection_reason}
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
              {action === 'valide' ? 'Valider le KYC' : 'Rejeter le KYC'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {action === 'valide'
                ? 'Êtes-vous sûr de vouloir valider ce document ?'
                : 'Veuillez indiquer la raison du rejet'}
            </DialogDescription>
          </DialogHeader>

          {action === 'rejete' && (
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-foreground">Raison du rejet *</Label>
              <Textarea
                id="reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Ex: Document illisible, photo floue, informations non correspondantes..."
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
              className={`flex-1 ${action === 'valide' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Traitement...' : 'Confirmer'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Image */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="bg-card border-border max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">{imageTitle}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center bg-black rounded-lg overflow-hidden">
            <img src={selectedImage} alt={imageTitle} className="max-w-full max-h-[70vh] object-contain" />
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
