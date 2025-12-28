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
import CreatorLayout from '@/components/CreatorLayout';

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
    <CreatorLayout>
      <div className="h-full overflow-auto bg-black">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-[#1a1a1a] to-black border-b border-white/5">
          <div className="px-8 py-8">
            <div className="flex items-center gap-3 mb-8">
              <Tag className="w-10 h-10 text-[#1DB954]" />
              <div>
                <h1 className="text-5xl font-bold text-white">Genres</h1>
                <p className="text-gray-400 text-lg">
                  Créez et gérez les genres d'histoires
                </p>
              </div>
            </div>

            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold px-8 py-6 text-base rounded-full shadow-xl hover:scale-105 transition-all"
            >
              <Plus className="mr-2 h-5 w-5" />
              Nouveau genre
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          <Card className="bg-[#181818] border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-2xl">
                <Tag className="h-5 w-5 text-[#1DB954]" />
                Liste des genres
              </CardTitle>
              <CardDescription className="text-gray-400">
                {genres.length} genre{genres.length > 1 ? 's' : ''} disponible{genres.length > 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#1DB954]" />
                </div>
              ) : genres.length === 0 ? (
                <div className="text-center py-12">
                  <Tag className="h-20 w-20 mx-auto text-gray-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2 text-white">Aucun genre</h3>
                  <p className="text-gray-400 mb-6 text-lg">
                    Créez votre premier genre pour commencer
                  </p>
                  <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold px-8 py-6 text-base rounded-full"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Créer un genre
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-gray-400">ID</TableHead>
                      <TableHead className="text-gray-400">Titre</TableHead>
                      <TableHead className="text-right text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {genres.map((genre) => (
                      <TableRow key={genre.id} className="border-white/10 hover:bg-[#282828]">
                        <TableCell className="font-mono text-sm text-gray-400">#{genre.id}</TableCell>
                        <TableCell className="font-medium text-white">{genre.title}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(genre)}
                              className="text-gray-400 hover:text-white hover:bg-[#282828]"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setGenreToDelete(genre)}
                              className="text-gray-400 hover:text-red-500 hover:bg-[#282828]"
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
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-[#282828] border-none text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">Créer un nouveau genre</DialogTitle>
            <DialogDescription className="text-gray-400">
              Ajoutez un nouveau genre pour vos histoires
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="create-title" className="text-white">Titre du genre</Label>
                <Input
                  id="create-title"
                  value={genreTitle}
                  onChange={(e) => setGenreTitle(e.target.value)}
                  placeholder="Ex: Science-Fiction, Romance..."
                  required
                  className="bg-[#3e3e3e] border-none text-white placeholder:text-gray-500"
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
                className="bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold"
              >
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
        <DialogContent className="bg-[#282828] border-none text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">Modifier le genre</DialogTitle>
            <DialogDescription className="text-gray-400">
              Modifiez le titre du genre
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="text-white">Titre du genre</Label>
                <Input
                  id="edit-title"
                  value={genreTitle}
                  onChange={(e) => setGenreTitle(e.target.value)}
                  placeholder="Ex: Science-Fiction, Romance..."
                  required
                  className="bg-[#3e3e3e] border-none text-white placeholder:text-gray-500"
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
                className="bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold"
              >
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
        <AlertDialogContent className="bg-[#282828] border-none text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Cette action désactivera le genre "{genreToDelete?.title}". 
              Les histoires existantes ne seront pas affectées, mais ce genre ne sera plus disponible pour les nouvelles histoires.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              disabled={isDeleting}
              className="bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
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
    </CreatorLayout>
  );
}
