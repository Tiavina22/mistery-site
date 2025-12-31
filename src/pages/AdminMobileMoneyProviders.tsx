import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, Edit2, Trash2, X, Check, Upload } from 'lucide-react';

interface Provider {
  id: number;
  name: string;
  code: string;
  logo?: string;
  is_active: boolean;
}

export default function AdminMobileMoneyProviders() {
  const { token } = useAdmin();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [formData, setFormData] = useState({ name: '', code: '', logo: null as string | null, is_active: true });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    loadProviders();
  }, [pagination.page, search, activeFilter, token]);

  const loadProviders = async () => {
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
        ...(activeFilter && { active: activeFilter })
      });

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5500';
      const response = await fetch(
        `${apiUrl}/api/admin/mobile-money-providers?${params}`,
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
        setProviders(data.data.providers);
        setPagination(prev => ({
          ...prev,
          total: data.data.pagination.total,
          totalPages: data.data.pagination.totalPages
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (provider?: Provider) => {
    if (provider) {
      setEditingProvider(provider);
      setFormData({
        name: provider.name,
        code: provider.code,
        logo: provider.logo || null,
        is_active: provider.is_active
      });
      setLogoPreview(provider.logo || null);
    } else {
      setEditingProvider(null);
      setFormData({ name: '', code: '', logo: null, is_active: true });
      setLogoPreview(null);
    }
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setEditingProvider(null);
    setFormData({ name: '', code: '', logo: null, is_active: true });
    setLogoPreview(null);
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }

    // Vérifier la taille (max 500KB)
    if (file.size > 500 * 1024) {
      alert('L\'image ne doit pas dépasser 500KB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData({ ...formData, logo: base64 });
      setLogoPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code) {
      alert('Tous les champs sont obligatoires');
      return;
    }

    setSubmitting(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5500';
      const url = editingProvider
        ? `${apiUrl}/api/admin/mobile-money-providers/${editingProvider.id}`
        : `${apiUrl}/api/admin/mobile-money-providers`;

      const response = await fetch(url, {
        method: editingProvider ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Erreur lors de la sauvegarde');
        return;
      }

      closeDialog();
      setPagination(prev => ({ ...prev, page: 1 }));
      loadProviders();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (providerId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce provider?')) {
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5500';
      const response = await fetch(
        `${apiUrl}/api/admin/mobile-money-providers/${providerId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Erreur lors de la suppression');
        return;
      }

      loadProviders();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
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
    <AdminLayout>
      <div className="space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{pagination.total}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">
                {providers.filter(p => p.is_active).length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Inactifs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-500">
                {providers.filter(p => !p.is_active).length}
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
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou code..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
                  className="pl-10 bg-secondary border-none text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <select
                value={activeFilter}
                onChange={(e) => {
                  setActiveFilter(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="px-4 py-2 rounded-lg bg-secondary border-none text-foreground"
              >
                <option value="">Tous les statuts</option>
                <option value="true">Actifs</option>
                <option value="false">Inactifs</option>
              </select>

              <Button
                onClick={() => openDialog()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter Provider
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des providers */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Providers Mobile Money</CardTitle>
            <CardDescription className="text-muted-foreground">
              Page {pagination.page} sur {pagination.totalPages}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {providers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Aucun provider trouvé</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Nom</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Code</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Statut</th>
                      <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers.map(provider => (
                      <tr key={provider.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {provider.logo && (
                              <img
                                src={provider.logo}
                                alt={provider.name}
                                className="w-8 h-8 rounded object-contain"
                              />
                            )}
                            <span className="font-medium text-foreground">{provider.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <code className="bg-secondary px-2 py-1 rounded text-foreground text-sm">
                            {provider.code}
                          </code>
                        </td>
                        <td className="py-3 px-4">
                          {provider.is_active ? (
                            <Badge className="bg-green-500">
                              <Check className="w-3 h-3 mr-1" /> Actif
                            </Badge>
                          ) : (
                            <Badge className="bg-red-500">
                              <X className="w-3 h-3 mr-1" /> Inactif
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-border"
                              onClick={() => openDialog(provider)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-500/50 hover:bg-red-500/10"
                              onClick={() => handleDelete(provider.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Total: {pagination.total} providers
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

      {/* Dialog Ajouter/Modifier Provider */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingProvider ? 'Modifier Provider' : 'Ajouter un Provider'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nom du Provider
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Orange Money"
                className="bg-secondary border-none text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Code (unique)
              </label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Ex: orange"
                className="bg-secondary border-none text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Logo du Provider
              </label>
              
              {logoPreview && (
                <div className="mb-3 flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex items-center gap-2">
                    <img 
                      src={logoPreview} 
                      alt="Preview" 
                      className="w-12 h-12 object-contain rounded"
                    />
                    <span className="text-sm text-muted-foreground">Logo actuel</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, logo: null });
                      setLogoPreview(null);
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                <Upload className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Sélectionner une image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-foreground cursor-pointer">
                Provider actif
              </label>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                className="border-border"
                onClick={closeDialog}
                disabled={submitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={submitting}
              >
                {submitting ? 'En cours...' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
