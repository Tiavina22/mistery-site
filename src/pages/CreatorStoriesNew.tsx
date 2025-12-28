import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authorApi, storyApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  BookOpen,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  FileText,
  Heart,
  MessageCircle,
  Clock,
  Check
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import CreatorLayout from '@/components/CreatorLayout';

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
  view_count: number;
  genre_id: number;
  genre: {
    id: number;
    title: string;
  };
  created_at: string;
  updated_at: string;
}

export default function CreatorStoriesNew() {
  const navigate = useNavigate();
  const { author, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [storyToEdit, setStoryToEdit] = useState<Story | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [storyToDelete, setStoryToDelete] = useState<Story | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !author) {
      navigate('/creator/login');
      return;
    }
    loadStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, author]);

  useEffect(() => {
    filterStories();
  }, [stories, searchQuery, statusFilter]);

  const loadStories = async () => {
    if (!author) return;

    try {
      setIsLoading(true);
      const response = await authorApi.getStories(author.id);
      setStories(response.data.data);
    } catch (error: any) {
      console.error('Error loading stories:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les histoires',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterStories = () => {
    let filtered = stories;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(story => story.status === statusFilter);
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(story => {
        const title = getStoryTitle(story.title).toLowerCase();
        return title.includes(searchQuery.toLowerCase());
      });
    }

    setFilteredStories(filtered);
  };

  const getStoryTitle = (title: any) => {
    if (typeof title === 'string') return title;
    return title?.gasy || title?.fr || title?.en || 'Sans titre';
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
      toast({
        title: 'Erreur',
        description: error.response?.data?.message || 'Impossible de supprimer l\'histoire',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
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
      toast({
        title: 'Erreur',
        description: error.response?.data?.message || 'Impossible de publier',
        variant: 'destructive',
      });
    }
  };

  const handleEditStory = (story: Story) => {
    setStoryToEdit(story);
    setShowCreateDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
      case 'draft':
        return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20';
      case 'archived':
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Publié';
      case 'draft': return 'Brouillon';
      case 'archived': return 'Archivé';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <BookOpen className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <CreatorLayout>
      <div className="h-full overflow-auto bg-black">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-[#1a1a1a] to-black border-b border-white/5">
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-white">Mes Histoires</h1>
                <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
                  {filteredStories.length} histoire{filteredStories.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Button 
                onClick={() => setShowCreateDialog(true)} 
                size="lg"
                className="bg-[#1DB954] hover:bg-[#1ed760] text-white font-semibold px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base rounded-full shadow-xl hover:scale-105 transition-all w-full sm:w-auto"
              >
                <Plus className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                Nouvelle histoire
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  placeholder="Rechercher une histoire..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-[#242424] border-none text-white placeholder:text-gray-500 h-12 rounded-full focus-visible:ring-2 focus-visible:ring-white/20"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 bg-[#242424] border-none text-white h-12 rounded-full">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent className="bg-[#282828] border-none text-white">
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="archived">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {filteredStories.length === 0 ? (
            <div className="py-16 text-center">
              <BookOpen className="h-20 w-20 mx-auto mb-4 text-gray-600" />
              <h3 className="text-2xl font-bold mb-2 text-white">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Aucune histoire trouvée' 
                  : 'Aucune histoire'}
              </h3>
              <p className="text-gray-400 mb-6 text-lg">
                {searchQuery || statusFilter !== 'all'
                  ? 'Essayez de modifier vos filtres'
                  : 'Commencez par créer votre première histoire'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-[#1DB954] hover:bg-[#1ed760] text-white font-semibold px-8 py-6 text-base rounded-full"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Créer une histoire
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {filteredStories.map((story) => (
                <div 
                  key={story.id} 
                  className="group bg-[#181818] hover:bg-[#282828] rounded-lg p-4 transition-all cursor-pointer"
                >
                  {/* Cover Image */}
                  <div className="relative aspect-square overflow-hidden rounded-md mb-4 bg-[#282828] shadow-2xl">
                    {story.cover_image ? (
                      <img
                        src={story.cover_image}
                        alt={getStoryTitle(story.title)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1DB954]/20 to-[#1DB954]/5">
                        <BookOpen className="w-16 h-16 text-[#1DB954]/40" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 left-2">
                      <Badge 
                        variant="secondary" 
                        className={`${getStatusColor(story.status)} backdrop-blur-sm font-medium`}
                      >
                        {getStatusLabel(story.status)}
                      </Badge>
                    </div>

                    {/* Premium Badge */}
                    {story.is_premium && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-yellow-500 text-black font-bold">Premium</Badge>
                      </div>
                    )}

                    {/* Play/Actions Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button 
                        size="icon" 
                        className="rounded-full bg-[#1DB954] hover:bg-[#1ed760] hover:scale-110 transition-all shadow-xl w-12 h-12 sm:w-14 sm:h-14"
                        onClick={() => navigate(`/creator/stories/${story.id}/chapters`)}
                      >
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="secondary" className="rounded-full bg-black/80 hover:bg-black w-9 h-9 sm:w-10 sm:h-10">
                            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#282828] border-none text-white">
                          <DropdownMenuItem 
                            onClick={() => navigate(`/creator/stories/${story.id}/chapters`)}
                            className="focus:bg-[#3e3e3e] focus:text-white"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Gérer chapitres
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleEditStory(story)}
                            className="focus:bg-[#3e3e3e] focus:text-white"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-[#3e3e3e] focus:text-white">
                            <Eye className="w-4 h-4 mr-2" />
                            Voir
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/10" />
                          {story.status === 'draft' && (
                            <>
                              <DropdownMenuItem 
                                onClick={() => handlePublish(story)}
                                className="focus:bg-[#3e3e3e] focus:text-white"
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Publier
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-white/10" />
                            </>
                          )}
                          <DropdownMenuItem
                            className="text-red-400 focus:bg-[#3e3e3e] focus:text-red-400"
                            onClick={() => setStoryToDelete(story)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Info */}
                  <div>
                    <h3 className="font-bold text-white mb-1 text-sm sm:text-base line-clamp-1 group-hover:underline">
                      {getStoryTitle(story.title)}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3 line-clamp-1">
                      {story.genre?.title}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>{story.chapters_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>{story.view_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>{story.reaction_count || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Dialog */}
      <CreateStoryDialog
        open={showCreateDialog}
        onOpenChange={(open) => {
          setShowCreateDialog(open);
          if (!open) setStoryToEdit(null); // Réinitialiser quand on ferme
        }}
        storyToEdit={storyToEdit}
        onSuccess={() => {
          setShowCreateDialog(false);
          setStoryToEdit(null);
          loadStories();
        }}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!storyToDelete} onOpenChange={(open) => !open && setStoryToDelete(null)}>
        <AlertDialogContent className="bg-[#282828] border-none text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Êtes-vous sûr de vouloir supprimer "{storyToDelete && getStoryTitle(storyToDelete.title)}" ?
              Cette action est irréversible.
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
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CreatorLayout>
  );
}
