import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Mail, Phone, Calendar, CheckCircle, Clock, XCircle, Eye, X } from 'lucide-react';

interface Author {
  id: number;
  pseudo: string;
  email: string;
  phone_number?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  kyc?: {
    status: 'en_verification' | 'valide' | 'rejete';
  };
}

export default function AdminAuthors() {
  const { token } = useAdmin();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [kycFilter, setKycFilter] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    loadAuthors();
  }, [pagination.page, search, statusFilter, kycFilter, token]);

  const loadAuthors = async () => {
    try {
      if (!token) {
        console.error('Token non disponible');
        return;
      }

      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        ...(kycFilter && { kyc_status: kycFilter })
      });

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5500';
      const response = await fetch(
        `${apiUrl}/api/admin/authors?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        console.error('Erreur:', response.status, response.statusText);
        return;
      }

      const data = await response.json();
      if (data.success) {
        setAuthors(data.data.authors);
        setPagination(prev => ({
          ...prev,
          total: data.data.pagination.total,
          totalPages: data.data.pagination.totalPages
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des créateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getKycStatusBadge = (status?: string) => {
    if (!status) {
      return <Badge className="bg-gray-500"><Clock className="w-3 h-3 mr-1" /> Pas de KYC</Badge>;
    }
    
    switch (status) {
      case 'valide':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Validé</Badge>;
      case 'rejete':
        return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" /> Rejeté</Badge>;
      case 'en_verification':
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" /> En vérification</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Actif</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500"><Clock className="w-3 h-3 mr-1" /> Inactif</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" /> Suspendu</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <AdminLayout>
        <div className="space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Créateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{pagination.total}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">KYC Validés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">
                {authors.filter(a => a.kyc?.status === 'valide').length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">En Vérification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-500">
                {authors.filter(a => a.kyc?.status === 'en_verification').length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Créateurs Actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {authors.filter(a => a.status === 'active').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recherche et Filtres */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Rechercher et Filtrer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher par pseudo ou email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="pl-10 bg-secondary border-none text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="px-3 py-2 rounded-lg bg-secondary border-none text-foreground"
              >
                <option value="">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="suspended">Suspendu</option>
              </select>

              <select
                value={kycFilter}
                onChange={(e) => {
                  setKycFilter(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="px-3 py-2 rounded-lg bg-secondary border-none text-foreground"
              >
                <option value="">Tous les KYC</option>
                <option value="valide">Validé</option>
                <option value="en_verification">En vérification</option>
                <option value="rejete">Rejeté</option>
                <option value="none">Pas de KYC</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Liste des créateurs */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Créateurs</CardTitle>
            <CardDescription className="text-muted-foreground">
              Page {pagination.page} sur {pagination.totalPages}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {authors.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Aucun créateur trouvé</p>
            ) : (
              <div className="space-y-3">
                {authors.map(author => (
                  <div
                    key={author.id}
                    className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border hover:border-primary transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-foreground mb-1">{author.pseudo}</div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {author.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {author.email}
                          </div>
                        )}
                        {author.phone_number && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {author.phone_number}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(author.created_at)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 ml-4">
                      {getStatusBadge(author.status)}
                      {getKycStatusBadge(author.kyc?.status)}
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-border hover:bg-primary/10"
                        onClick={() => {
                          setSelectedAuthor(author);
                          setShowDialog(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Total: {pagination.total} créateurs
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === 1}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    className="border-border"
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    className="border-border"
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>

    {/* Dialog détails du créateur */}
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Détails du Créateur</DialogTitle>
          <button
            onClick={() => setShowDialog(false)}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        {selectedAuthor && (
          <div className="space-y-6">
            {/* Informations personnelles */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Informations Personnelles</h3>
              <div className="grid grid-cols-2 gap-4 p-4 bg-secondary rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Pseudo</p>
                  <p className="font-medium text-foreground">{selectedAuthor.pseudo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{selectedAuthor.email}</p>
                </div>
                {selectedAuthor.phone_number && (
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <p className="font-medium text-foreground">{selectedAuthor.phone_number}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Membre depuis</p>
                  <p className="font-medium text-foreground">{formatDate(selectedAuthor.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Statuts */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Statuts</h3>
              <div className="grid grid-cols-2 gap-4 p-4 bg-secondary rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Statut du Compte</p>
                  <div>{getStatusBadge(selectedAuthor.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Statut KYC</p>
                  <div>{getKycStatusBadge(selectedAuthor.kyc?.status)}</div>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                className="border-border"
                onClick={() => setShowDialog(false)}
              >
                Fermer
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
}
