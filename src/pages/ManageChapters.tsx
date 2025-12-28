import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chapterApi, storyApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  Pencil, 
  Trash2, 
  Eye,
  BookOpen 
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import ChapterDialog from '@/components/ChapterDialog';

interface Chapter {
  id: number;
  story_id: number;
  title: {
    gasy?: string;
    fr?: string;
    en?: string;
  };
  content: {
    gasy?: string;
    fr?: string;
    en?: string;
  };
  chapter_number: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

interface Story {
  id: number;
  title: {
    gasy?: string;
    fr?: string;
    en?: string;
  };
  chapters_count: number;
  status: string;
}

export default function ManageChapters() {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<number | null>(null);

  useEffect(() => {
    loadStoryAndChapters();
  }, [storyId]);

  const loadStoryAndChapters = async () => {
    try {
      setLoading(true);
      
      // Charger l'histoire
      const storyResponse = await storyApi.getStory(Number(storyId));
      setStory(storyResponse.data.data);
      
      // Charger les chapitres
      const chaptersResponse = await chapterApi.getChaptersByStory(Number(storyId));
      setChapters(chaptersResponse.data.data);
    } catch (error: any) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: 'Erreur',
        description: error.response?.data?.message || 'Impossible de charger les données',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChapter = () => {
    setEditingChapter(null);
    setDialogOpen(true);
  };

  const handleEditChapter = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setDialogOpen(true);
  };

  const handleDeleteClick = (chapterId: number) => {
    setChapterToDelete(chapterId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!chapterToDelete) return;

    try {
      await chapterApi.deleteChapter(chapterToDelete);
      
      toast({
        title: 'Succès',
        description: 'Chapitre supprimé avec succès',
      });
      
      setDeleteDialogOpen(false);
      setChapterToDelete(null);
      loadStoryAndChapters();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: 'Erreur',
        description: error.response?.data?.message || 'Impossible de supprimer le chapitre',
        variant: 'destructive',
      });
    }
  };

  const handlePublishChapter = async (chapterId: number) => {
    try {
      await chapterApi.publishChapter(chapterId);
      
      toast({
        title: 'Succès',
        description: 'Chapitre publié avec succès',
      });
      
      loadStoryAndChapters();
    } catch (error: any) {
      console.error('Erreur lors de la publication:', error);
      toast({
        title: 'Erreur',
        description: error.response?.data?.message || 'Impossible de publier le chapitre',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500">Publié</Badge>;
      case 'draft':
        return <Badge variant="secondary">Brouillon</Badge>;
      case 'archived':
        return <Badge variant="outline">Archivé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getChapterTitle = (title: any) => {
    if (typeof title === 'string') return title;
    return title?.gasy || title?.fr || title?.en || 'Sans titre';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <BookOpen className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* En-tête */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/creator/stories')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux histoires
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {story ? getChapterTitle(story.title) : 'Gestion des chapitres'}
            </h1>
            <p className="text-muted-foreground">
              {chapters.length} chapitre{chapters.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <Button onClick={handleCreateChapter}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau chapitre
          </Button>
        </div>
      </div>

      {/* Liste des chapitres */}
      {chapters.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Aucun chapitre</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par créer votre premier chapitre
              </p>
              <Button onClick={handleCreateChapter}>
                <Plus className="mr-2 h-4 w-4" />
                Créer un chapitre
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Chapitres</CardTitle>
            <CardDescription>
              Gérez les chapitres de votre histoire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">N°</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead className="w-32">Statut</TableHead>
                  <TableHead className="w-48">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chapters.map((chapter) => (
                  <TableRow key={chapter.id}>
                    <TableCell className="font-medium">
                      {chapter.chapter_number}
                    </TableCell>
                    <TableCell>
                      {getChapterTitle(chapter.title)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(chapter.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditChapter(chapter)}
                          title="Modifier"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        
                        {chapter.status === 'draft' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePublishChapter(chapter.id)}
                            title="Publier"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(chapter.id)}
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Dialog de création/édition */}
      <ChapterDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        chapter={editingChapter}
        storyId={Number(storyId)}
        onSuccess={() => {
          setDialogOpen(false);
          loadStoryAndChapters();
        }}
      />

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce chapitre ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
