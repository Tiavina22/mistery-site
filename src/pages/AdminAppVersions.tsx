import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Smartphone, 
  Apple, 
  Calendar,
  Link,
  Check,
  X,
  AlertCircle,
  Download
} from 'lucide-react';

interface Version {
  id: number;
  version_name: string;
  version_code: number;
  description: string | null;
  start_date: string;
  end_date: string | null;
  download_url: string;
  platform: 'ios' | 'android' | 'both';
  is_active: boolean;
  is_required: boolean;
  createdAt: string;
  updatedAt: string;
}

interface VersionFormData {
  version_name: string;
  version_code: number;
  description: string;
  start_date: string;
  end_date: string;
  download_url: string;
  platform: 'ios' | 'android' | 'both';
  is_active: boolean;
  is_required: boolean;
}

const initialFormData: VersionFormData = {
  version_name: '',
  version_code: 1,
  description: '',
  start_date: new Date().toISOString().split('T')[0],
  end_date: '',
  download_url: '',
  platform: 'both',
  is_active: true,
  is_required: false,
};

export default function AdminAppVersions() {
  const { token } = useAdmin();
  const { toast } = useToast();
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingVersion, setEditingVersion] = useState<Version | null>(null);
  const [deletingVersion, setDeletingVersion] = useState<Version | null>(null);
  const [formData, setFormData] = useState<VersionFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadVersions();
  }, []);

  const loadVersions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/version`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      if (data.success) {
        setVersions(data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des versions:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les versions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingVersion(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  const openEditDialog = (version: Version) => {
    setEditingVersion(version);
    setFormData({
      version_name: version.version_name,
      version_code: version.version_code,
      description: version.description || '',
      start_date: version.start_date ? version.start_date.split('T')[0] : '',
      end_date: version.end_date ? version.end_date.split('T')[0] : '',
      download_url: version.download_url,
      platform: version.platform,
      is_active: version.is_active,
      is_required: version.is_required,
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (version: Version) => {
    setDeletingVersion(version);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.version_name || !formData.version_code || !formData.download_url) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);

      const url = editingVersion
        ? `${import.meta.env.VITE_API_URL}/api/version/${editingVersion.id}`
        : `${import.meta.env.VITE_API_URL}/api/version`;

      const method = editingVersion ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          end_date: formData.end_date || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Succès',
          description: editingVersion ? 'Version mise à jour' : 'Version créée',
        });
        setIsDialogOpen(false);
        loadVersions();
      } else {
        toast({
          title: 'Erreur',
          description: data.message || 'Une erreur est survenue',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingVersion) return;

    try {
      setSubmitting(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/version/${deletingVersion.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Succès',
          description: 'Version supprimée',
        });
        setIsDeleteDialogOpen(false);
        setDeletingVersion(null);
        loadVersions();
      } else {
        toast({
          title: 'Erreur',
          description: data.message || 'Une erreur est survenue',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleVersionActive = async (version: Version) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/version/${version.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            is_active: !version.is_active,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Succès',
          description: `Version ${!version.is_active ? 'activée' : 'désactivée'}`,
        });
        loadVersions();
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive',
      });
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'ios':
        return <Apple className="w-4 h-4" />;
      case 'android':
        return <Smartphone className="w-4 h-4" />;
      default:
        return (
          <div className="flex gap-1">
            <Apple className="w-4 h-4" />
            <Smartphone className="w-4 h-4" />
          </div>
        );
    }
  };

  const getPlatformLabel = (platform: string) => {
    switch (platform) {
      case 'ios':
        return 'iOS';
      case 'android':
        return 'Android';
      default:
        return 'iOS & Android';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const isVersionExpired = (version: Version) => {
    if (!version.end_date) return false;
    return new Date(version.end_date) < new Date();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Versions de l'application</h1>
            <p className="text-muted-foreground">Gérez les versions de l'application mobile</p>
          </div>
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle version
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Versions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{versions.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Versions Actives</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">
                {versions.filter(v => v.is_active).length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Versions Expirées</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-500">
                {versions.filter(v => isVersionExpired(v)).length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Mise à jour requise</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-500">
                {versions.filter(v => v.is_required).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des versions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Liste des versions</CardTitle>
            <CardDescription>Toutes les versions de l'application</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Chargement...
              </div>
            ) : versions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune version trouvée
              </div>
            ) : (
              <div className="space-y-4">
                {versions.map((version) => (
                  <div
                    key={version.id}
                    className={`p-4 rounded-lg border ${
                      version.is_active 
                        ? 'border-green-500/30 bg-green-500/5' 
                        : 'border-border bg-secondary/30'
                    } ${isVersionExpired(version) ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-foreground">
                            v{version.version_name}
                          </h3>
                          <Badge variant="outline" className="gap-1">
                            {getPlatformIcon(version.platform)}
                            {getPlatformLabel(version.platform)}
                          </Badge>
                          {version.is_active ? (
                            <Badge className="bg-green-500 hover:bg-green-600">
                              <Check className="w-3 h-3 mr-1" />
                              Actif
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <X className="w-3 h-3 mr-1" />
                              Inactif
                            </Badge>
                          )}
                          {version.is_required && (
                            <Badge variant="destructive">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Obligatoire
                            </Badge>
                          )}
                          {isVersionExpired(version) && (
                            <Badge variant="outline" className="border-orange-500 text-orange-500">
                              Expiré
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <span className="font-medium">Code:</span> {version.version_code}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(version.start_date)} - {formatDate(version.end_date)}
                          </span>
                        </div>

                        {version.description && (
                          <p className="text-sm text-muted-foreground">{version.description}</p>
                        )}

                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Link className="w-4 h-4" />
                          <a 
                            href={version.download_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline truncate max-w-md"
                          >
                            {version.download_url}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleVersionActive(version)}
                          title={version.is_active ? 'Désactiver' : 'Activer'}
                        >
                          {version.is_active ? (
                            <X className="w-4 h-4 text-red-500" />
                          ) : (
                            <Check className="w-4 h-4 text-green-500" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(version)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(version)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog Création/Edition */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingVersion ? 'Modifier la version' : 'Nouvelle version'}
              </DialogTitle>
              <DialogDescription>
                {editingVersion 
                  ? 'Modifiez les informations de la version' 
                  : 'Créez une nouvelle version de l\'application'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="version_name">Nom de version *</Label>
                  <Input
                    id="version_name"
                    placeholder="1.0.0"
                    value={formData.version_name}
                    onChange={(e) => setFormData({ ...formData, version_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="version_code">Code de version *</Label>
                  <Input
                    id="version_code"
                    type="number"
                    placeholder="1"
                    value={formData.version_code}
                    onChange={(e) => setFormData({ ...formData, version_code: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Plateforme *</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(value: 'ios' | 'android' | 'both') => 
                    setFormData({ ...formData, platform: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">iOS & Android</SelectItem>
                    <SelectItem value="ios">iOS uniquement</SelectItem>
                    <SelectItem value="android">Android uniquement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="download_url">URL de téléchargement *</Label>
                <Input
                  id="download_url"
                  placeholder="https://play.google.com/store/apps/..."
                  value={formData.download_url}
                  onChange={(e) => setFormData({ ...formData, download_url: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Nouveautés de cette version..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Date de début *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">Date de fin (optionnel)</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Version active</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="is_required"
                    checked={formData.is_required}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_required: checked })}
                  />
                  <Label htmlFor="is_required">Mise à jour obligatoire</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Enregistrement...' : editingVersion ? 'Mettre à jour' : 'Créer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Suppression */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Supprimer la version</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer la version {deletingVersion?.version_name} ?
                Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
                {submitting ? 'Suppression...' : 'Supprimer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
