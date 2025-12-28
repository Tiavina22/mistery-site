import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { authorApi, storyApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import {
  BookOpen,
  ArrowLeft,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Archive,
  Send,
  Plus,
  Loader2,
  FileText
} from 'lucide-react';
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
import CreateStoryDialog from '@/components/CreateStoryDialog';

interface Story {
  id: number;
  title: any;
  synopsis: any;
  status: string;
  is_premium: boolean;
  cover_image: string;
  chapters_count: number;
  reaction_count: number;
  comment_count: number;
  created_at: string;
  genre: {
    id: number;
    title: string;
  };
}

export default function CreatorStories() {
  const navigate = useNavigate();
  const { author, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [storyToDelete, setStoryToDelete] = useState<Story | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/creator/login');
      return;
    }

    loadStories();
  }, [isAuthenticated, navigate, activeTab]);

  const loadStories = async () => {
    if (!author) return;

    try {
      setIsLoading(true);
      const status = activeTab === 'all' ? undefined : activeTab;
      const response = await authorApi.getStories(author.id, status);
      setStories(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des histoires:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les histoires',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async (story: Story) => {
    try {
      await storyApi.publishStory(story.id);
      toast({
        title: 'Succès',
        description: 'Histoire publiée avec succès',
      });
      loadStories();
    } catch (error: any) {
      console.error('Erreur lors de la publication:', error);
      toast({
        title: 'Erreur',
        description: error.response?.data?.message || 'Erreur lors de la publication',
        variant: 'destructive',
      });
    }
  };

  const handleArchive = async (story: Story) => {
    try {
      await storyApi.archiveStory(story.id);
      toast({
        title: 'Succès',
        description: 'Histoire archivée avec succès',
      });
      loadStories();
    } catch (error: any) {
      console.error('Erreur lors de l\'archivage:', error);
      toast({
        title: 'Erreur',
        description: error.response?.data?.message || 'Erreur lors de l\'archivage',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!storyToDelete) return;

    try {
      setIsDeleting(true);
      await storyApi.deleteStory(storyToDelete.id);
      toast({
        title: 'Succès',
        description: 'Histoire supprimée avec succès',
      });
      setStoryToDelete(null);
      loadStories();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: 'Erreur',
        description: error.response?.data?.message || 'Erreur lors de la suppression',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getStoryTitle = (title: any) => {
    if (typeof title === 'string') return title;
    return title?.gasy || title?.[language] || title?.fr || title?.en || 'Sans titre';
  };

  const getStorySynopsis = (synopsis: any) => {
    if (!synopsis) return '';
    if (typeof synopsis === 'string') return synopsis;
    return synopsis?.gasy || synopsis?.[language] || synopsis?.fr || synopsis?.en || '';
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      draft: { variant: 'secondary', label: 'Brouillon' },
      published: { variant: 'default', label: 'Publié' },
      archived: { variant: 'outline', label: 'Archivé' },
    };

    const config = variants[status] || variants.draft;
    return (
      <Badge variant={config.variant as any}>{config.label}</Badge>
    );
  };

  const filteredStories = stories;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
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
              <h1 className="text-3xl font-bold">Mes Histoires</h1>
              <p className="text-muted-foreground">
                Gérez toutes vos créations
              </p>
            </div>
          </div>

          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle histoire
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="draft">Brouillons</TabsTrigger>
            <TabsTrigger value="published">Publiées</TabsTrigger>
            <TabsTrigger value="archived">Archivées</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ) : filteredStories.length === 0 ? (
              <Card className="py-12">
                <CardContent className="text-center">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune histoire</h3>
                  <p className="text-muted-foreground mb-4">
                    Commencez à créer votre première histoire
                  </p>
                  <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Créer une histoire
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStories.map((story) => (
                  <Card key={story.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          {getStatusBadge(story.status)}
                          {story.is_premium && (
                            <Badge variant="outline" className="ml-2 border-yellow-500 text-yellow-600">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/creator/stories/${story.id}/chapters`)}>
                              <FileText className="mr-2 h-4 w-4" />
                              Gérer chapitres
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {story.status === 'draft' && (
                              <DropdownMenuItem onClick={() => handlePublish(story)}>
                                <Send className="mr-2 h-4 w-4" />
                                Publier
                              </DropdownMenuItem>
                            )}
                            {story.status === 'published' && (
                              <DropdownMenuItem onClick={() => handleArchive(story)}>
                                <Archive className="mr-2 h-4 w-4" />
                                Archiver
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setStoryToDelete(story)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <CardTitle className="line-clamp-2">
                        {getStoryTitle(story.title)}
                      </CardTitle>
                      <CardDescription className="line-clamp-1">
                        {story.genre.title}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      {story.cover_image && (
                        <img
                          src={story.cover_image}
                          alt={getStoryTitle(story.title)}
                          className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                      )}
                      
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {getStorySynopsis(story.synopsis) || 'Pas de synopsis'}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{story.chapters_count} chapitres</span>
                        <span>❤️ {story.reaction_count}</span>
                        <span>💬 {story.comment_count}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!storyToDelete} onOpenChange={(open) => !open && setStoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'histoire "{storyToDelete && getStoryTitle(storyToDelete.title)}" 
              et tous ses chapitres seront définitivement supprimés.
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

      {/* Create Story Dialog */}
      <CreateStoryDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
        onSuccess={loadStories}
      />
    </div>
  );
}
