import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { storyApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Edit, Trash2, Loader2, Tag } from 'lucide-react';

interface Genre {
  id: number;
  title: string;
  status: string;
}

export default function ManageGenres() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [genreToDelete, setGenreToDelete] = useState<Genre | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [genreTitle, setGenreTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/creator/login');
      return;
    }

    loadGenres();
  }, [isAuthenticated, navigate]);

  const loadGenres = async () => {
    try {
      setIsLoading(true);
      const response = await storyApi.getGenres();
      setGenres(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des genres:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les genres',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!genreTitle.trim()) {
      toast({
        title: 'Erreur',
        description: 'Le titre du genre est requis',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await storyApi.createGenre({ title: genreTitle });
      
      toast({
        title: 'Succès',
        description: 'Genre créé avec succès',
      });

      setGenreTitle('');
      setShowCreateDialog(false);
      loadGenres();
    } catch (error: any) {
      console.error('Erreur lors de la création:', error);
      toast({
        title: 'Erreur',
        description: error.response?.data?.message || 'Erreur lors de la création du genre',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGenre || !genreTitle.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await storyApi.updateGenre(selectedGenre.id, { title: genreTitle });
      
      toast({
        title: 'Succès',
        description: 'Genre mis à jour avec succès',
      });

      setGenreTitle('');
      setSelectedGenre(null);
      setShowEditDialog(false);
      loadGenres();
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: 'Erreur',
        description: error.response?.data?.message || 'Erreur lors de la mise à jour du genre',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!genreToDelete) return;

    try {
      setIsDeleting(true);
      await storyApi.deleteGenre(genreToDelete.id);
      
      toast({
        title: 'Succès',
        description: 'Genre supprimé avec succès',
      });

      setGenreToDelete(null);
      loadGenres();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: 'Erreur',
        description: error.response?.data?.message || 'Erreur lors de la suppression du genre',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditDialog = (genre: Genre) => {
    setSelectedGenre(genre);
    setGenreTitle(genre.title);
    setShowEditDialog(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/creator/dashboard')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Gestion des Genres</h1>
              <p className="text-muted-foreground">
                Créez et gérez les genres d'histoires
              </p>
            </div>
          </div>

          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouveau genre
          </Button>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Liste des genres
            </CardTitle>
            <CardDescription>
              {genres.length} genre{genres.length > 1 ? 's' : ''} disponible{genres.length > 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ) : genres.length === 0 ? (
              <div className="text-center py-12">
                <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun genre</h3>
                <p className="text-muted-foreground mb-4">
                  Créez votre premier genre pour commencer
                </p>
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Créer un genre
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {genres.map((genre) => (
                    <TableRow key={genre.id}>
                      <TableCell className="font-mono text-sm">#{genre.id}</TableCell>
                      <TableCell className="font-medium">{genre.title}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(genre)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setGenreToDelete(genre)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un nouveau genre</DialogTitle>
            <DialogDescription>
              Ajoutez un nouveau genre pour vos histoires
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="create-title">Titre du genre</Label>
                <Input
                  id="create-title"
                  value={genreTitle}
                  onChange={(e) => setGenreTitle(e.target.value)}
                  placeholder="Ex: Science-Fiction, Romance..."
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false);
                  setGenreTitle('');
                }}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  'Créer'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le genre</DialogTitle>
            <DialogDescription>
              Modifiez le titre du genre
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Titre du genre</Label>
                <Input
                  id="edit-title"
                  value={genreTitle}
                  onChange={(e) => setGenreTitle(e.target.value)}
                  placeholder="Ex: Science-Fiction, Romance..."
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEditDialog(false);
                  setGenreTitle('');
                  setSelectedGenre(null);
                }}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  'Enregistrer'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!genreToDelete} onOpenChange={(open) => !open && setGenreToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action désactivera le genre "{genreToDelete?.title}". 
              Les histoires existantes ne seront pas affectées, mais ce genre ne sera plus disponible pour les nouvelles histoires.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                'Supprimer'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
