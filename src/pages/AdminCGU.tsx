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
  FileText,
  Globe,
  Calendar,
  Check,
  X,
  Languages
} from 'lucide-react';

interface CGU {
  id: number;
  language: 'FR' | 'EN';
  title: string;
  content: string;
  version: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CGUFormData {
  language: 'FR' | 'EN';
  title: string;
  content: string;
  version: string;
  is_active: boolean;
}

const initialFormData: CGUFormData = {
  language: 'FR',
  title: '',
  content: '',
  version: '1.0',
  is_active: true,
};

export default function AdminCGU() {
  const { token } = useAdmin();
  const { toast } = useToast();
  const [cgus, setCgus] = useState<CGU[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCGU, setEditingCGU] = useState<CGU | null>(null);
  const [deletingCGU, setDeletingCGU] = useState<CGU | null>(null);
  const [formData, setFormData] = useState<CGUFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCGUs();
  }, []);

  const loadCGUs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cgu/all`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      if (data.success) {
        setCgus(data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des CGU:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les CGU',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingCGU(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  const openEditDialog = (cgu: CGU) => {
    setEditingCGU(cgu);
    setFormData({
      language: cgu.language,
      title: cgu.title,
      content: cgu.content,
      version: cgu.version,
      is_active: cgu.is_active,
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (cgu: CGU) => {
    setDeletingCGU(cgu);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.content || !formData.version) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);

      const url = editingCGU
        ? `${import.meta.env.VITE_API_URL}/api/cgu/${editingCGU.id}`
        : `${import.meta.env.VITE_API_URL}/api/cgu`;

      const method = editingCGU ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Succès',
          description: editingCGU ? 'CGU mis à jour' : 'CGU créé',
        });
        setIsDialogOpen(false);
        loadCGUs();
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
    if (!deletingCGU) return;

    try {
      setSubmitting(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cgu/${deletingCGU.id}`,
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
          description: 'CGU supprimé',
        });
        setIsDeleteDialogOpen(false);
        setDeletingCGU(null);
        loadCGUs();
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

  const toggleCGUActive = async (cgu: CGU) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cgu/${cgu.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...cgu,
            is_active: !cgu.is_active,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Succès',
          description: `CGU ${!cgu.is_active ? 'activé' : 'désactivé'}`,
        });
        loadCGUs();
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
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">CGU</h1>
            <p className="text-muted-foreground">
              Gérer les Conditions Générales d'Utilisation
            </p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau CGU
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {cgus.map((cgu) => (
              <Card key={cgu.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {cgu.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Languages className="h-4 w-4" />
                        {cgu.language === 'FR' ? 'Français' : 'English'}
                      </CardDescription>
                    </div>
                    <Badge variant={cgu.is_active ? 'default' : 'secondary'}>
                      {cgu.is_active ? (
                        <>
                          <Check className="mr-1 h-3 w-3" />
                          Actif
                        </>
                      ) : (
                        <>
                          <X className="mr-1 h-3 w-3" />
                          Inactif
                        </>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <span>Version: {cgu.version}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Mis à jour: {new Date(cgu.updated_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>

                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm line-clamp-3">{cgu.content.substring(0, 150)}...</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={cgu.is_active}
                        onCheckedChange={() => toggleCGUActive(cgu)}
                      />
                      <span className="text-sm">Actif</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(cgu)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(cgu)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCGU ? 'Modifier le CGU' : 'Nouveau CGU'}
              </DialogTitle>
              <DialogDescription>
                {editingCGU
                  ? 'Modifier les informations du CGU'
                  : 'Créer un nouveau CGU'}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="language">Langue *</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value: 'FR' | 'EN') =>
                    setFormData({ ...formData, language: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FR">Français</SelectItem>
                    <SelectItem value="EN">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Conditions Générales d'Utilisation"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="version">Version *</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) =>
                    setFormData({ ...formData, version: e.target.value })
                  }
                  placeholder="1.0"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">Contenu * (Markdown supporté)</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="# Titre&#10;&#10;## Section 1&#10;&#10;Votre contenu ici..."
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label htmlFor="is_active">Actif</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'En cours...' : editingCGU ? 'Mettre à jour' : 'Créer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer ce CGU ?
                <br />
                <strong>{deletingCGU?.title}</strong> ({deletingCGU?.language})
                <br />
                Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={submitting}
              >
                {submitting ? 'Suppression...' : 'Supprimer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
