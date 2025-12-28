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
import CreatorLayout from '@/components/CreatorLayout';

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
      <CreatorLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <BookOpen className="h-12 w-12 animate-pulse mx-auto mb-4 text-[#1DB954]" />
            <p className="text-gray-400">Chargement...</p>
          </div>
        </div>
      </CreatorLayout>
    );
  }

  return (
    <CreatorLayout>
      <div className="h-full overflow-auto bg-black">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-[#1a1a1a] to-black border-b border-white/5">
          <div className="px-8 py-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/creator/stories')}
              className="mb-6 text-gray-400 hover:text-white hover:bg-[#282828] -ml-2"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Retour aux histoires
            </Button>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-5xl font-bold mb-2 text-white">
                  {story ? getChapterTitle(story.title) : 'Gestion des chapitres'}
                </h1>
                <p className="text-gray-400 text-lg">
                  {chapters.length} chapitre{chapters.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <Button 
                onClick={handleCreateChapter}
                className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold px-8 py-6 text-base rounded-full shadow-xl hover:scale-105 transition-all"
              >
                <Plus className="mr-2 h-5 w-5" />
                Nouveau chapitre
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          {chapters.length === 0 ? (
            <div className="py-16 text-center">
              <FileText className="h-20 w-20 mx-auto mb-4 text-gray-600" />
              <h3 className="text-2xl font-bold mb-2 text-white">Aucun chapitre</h3>
              <p className="text-gray-400 mb-6 text-lg">
                Commencez par créer votre premier chapitre
              </p>
              <Button 
                onClick={handleCreateChapter}
                className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold px-8 py-6 text-base rounded-full"
              >
                <Plus className="mr-2 h-5 w-5" />
                Créer un chapitre
              </Button>
            </div>
          ) : (
            <Card className="bg-[#181818] border-none">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Chapitres</CardTitle>
                <CardDescription className="text-gray-400">
                  Gérez les chapitres de votre histoire
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="w-20 text-gray-400">N°</TableHead>
                      <TableHead className="text-gray-400">Titre</TableHead>
                      <TableHead className="w-32 text-gray-400">Statut</TableHead>
                      <TableHead className="w-48 text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chapters.map((chapter) => (
                      <TableRow key={chapter.id} className="border-white/10 hover:bg-[#282828]">
                        <TableCell className="font-medium text-white">
                          {chapter.chapter_number}
                        </TableCell>
                        <TableCell className="text-white">
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
                              className="text-gray-400 hover:text-white hover:bg-[#282828]"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            
                            {chapter.status === 'draft' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handlePublishChapter(chapter.id)}
                                title="Publier"
                                className="text-gray-400 hover:text-[#1DB954] hover:bg-[#282828]"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(chapter.id)}
                              title="Supprimer"
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
              </CardContent>
            </Card>
          )}
        </div>
      </div>

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
        <AlertDialogContent className="bg-[#282828] border-none text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Êtes-vous sûr de vouloir supprimer ce chapitre ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/20 text-white hover:bg-white/10">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CreatorLayout>
  );
}
