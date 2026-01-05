import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Video,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Clock,
  Check,
  Loader2,
  Play,
  Heart,
  MessageCircle
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
import CreatorLayout from '@/components/CreatorLayout';
import CreateVideoDialog from '@/components/CreateVideoDialog';

interface VideoItem {
  id: number;
  title: any;
  synopsis: any;
  status: string;
  is_premium: boolean;
  thumbnail_image: string;
  duration: number;
  view_count: number;
  reaction_count: number;
  comment_count: number;
  genre_id: number;
  genre: {
    id: number;
    title: string;
  };
  created_at: string;
  updated_at: string;
}

export default function CreatorVideos() {
  const navigate = useNavigate();
  const { author, isAuthenticated, kyc_status } = useAuth();
  const { toast } = useToast();

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [videoToDelete, setVideoToDelete] = useState<VideoItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !author) {
      navigate('/creator/login');
      return;
    }
    loadVideos();
  }, [isAuthenticated, author]);

  useEffect(() => {
    filterVideos();
  }, [videos, searchQuery, statusFilter]);

  const loadVideos = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('author_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/videos/my-videos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setVideos(data.data);
      }
    } catch (error: any) {
      console.error('Error loading videos:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les vidéos',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterVideos = () => {
    let filtered = videos;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(video => video.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(video => {
        const title = getVideoTitle(video.title).toLowerCase();
        return title.includes(searchQuery.toLowerCase());
      });
    }

    setFilteredVideos(filtered);
  };

  const getVideoTitle = (title: any): string => {
    if (typeof title === 'string') return title;
    return title?.fr || title?.en || title?.mg || 'Sans titre';
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleDelete = async (videoId: number) => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem('author_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/videos/${videoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      toast({
        title: 'Succès',
        description: 'Vidéo supprimée avec succès',
      });

      loadVideos();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors de la suppression',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setVideoToDelete(null);
    }
  };

  const handlePublish = async (videoId: number) => {
    try {
      const token = localStorage.getItem('author_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/videos/${videoId}/publish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      toast({
        title: 'Succès',
        description: 'Vidéo publiée avec succès',
      });

      loadVideos();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors de la publication',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Brouillon', className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100' },
      published: { label: 'Publié', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' },
      archived: { label: 'Archivé', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100' },
      scheduled: { label: 'Programmé', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <CreatorLayout>
      <div className="h-full overflow-auto bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-secondary to-background border-b border-border">
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 flex items-center gap-2 text-foreground">
                  <Video className="h-8 w-8 text-purple-600" />
                  Mes Vidéos
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
                  Gérez et publiez vos contenus vidéo
                </p>
              </div>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base rounded-lg shadow-lg hover:scale-105 transition-all w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 sm:h-5 w-4 sm:h-5" />
                Nouvelle Vidéo
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une vidéo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                  <SelectItem value="archived">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredVideos.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Video className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune vidéo</h3>
              <p className="text-muted-foreground text-center mb-6">
                {searchQuery || statusFilter !== 'all'
                  ? 'Aucune vidéo ne correspond à vos critères de recherche'
                  : 'Commencez à créer vos premières vidéos'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer ma première vidéo
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Videos Grid */}
        {!isLoading && filteredVideos.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-200 dark:bg-gray-800">
                  {video.thumbnail_image ? (
                    <img
                      src={video.thumbnail_image}
                      alt={getVideoTitle(video.title)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Play className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                    {formatDuration(video.duration)}
                  </div>
                  {video.is_premium && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                      Premium
                    </Badge>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">
                        {getVideoTitle(video.title)}
                      </h3>
                      {video.genre && (
                        <p className="text-xs text-muted-foreground">
                          {video.genre.title}
                        </p>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/creator/videos/edit/${video.id}`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        {video.status === 'draft' && (
                          <DropdownMenuItem onClick={() => handlePublish(video.id)}>
                            <Check className="mr-2 h-4 w-4" />
                            Publier
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setVideoToDelete(video)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Status */}
                  <div className="mb-3">
                    {getStatusBadge(video.status)}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {video.view_count || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {video.reaction_count || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {video.comment_count || 0}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Video Dialog */}
        <CreateVideoDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSuccess={loadVideos}
          kycStatus={kyc_status}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!videoToDelete} onOpenChange={() => setVideoToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer la vidéo "{videoToDelete ? getVideoTitle(videoToDelete.title) : ''}" ?
                Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => videoToDelete && handleDelete(videoToDelete.id)}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
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
      </div>
    </CreatorLayout>
  );
}
