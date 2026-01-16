import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle, Clock, Eye, User, BookOpen, FileText, Calendar, Edit, ChevronLeft, ChevronRight } from 'lucide-react';

interface Author {
  id: number;
  pseudo: string;
  email: string;
  avatar?: string;
  biography?: string;
}

interface Genre {
  id: number;
  title: { fr?: string; en?: string; gasy?: string } | string;
}

interface ChapterItem {
  id: number;
  chapter_number: number;
  title: { fr?: string; en?: string; gasy?: string } | string;
  content: { fr?: string; en?: string; gasy?: string } | string;
  status: string;
  created_at: string;
}

interface StoryItem {
  id: number;
  title: { fr?: string; en?: string; gasy?: string } | string;
  synopsis?: { fr?: string; en?: string; gasy?: string } | string;
  cover_image?: string;
  is_premium: boolean;
  chapters_count: number;
  status: string;
  submitted_at?: string;
  created_at: string;
  author: Author;
  genre: Genre;
  chapters?: ChapterItem[];
}

interface PendingChapter {
  id: number;
  chapter_number: number;
  title: { fr?: string; en?: string; gasy?: string } | string;
  content: { fr?: string; en?: string; gasy?: string } | string;
  status: string;
  submitted_at?: string;
  created_at: string;
  story: {
    id: number;
    title: { fr?: string; en?: string; gasy?: string } | string;
    author_id: number;
    author: Author;
  };
}

// Helper to extract text from JSONB title/content
const getText = (value: { fr?: string; en?: string; gasy?: string } | string | undefined, lang: string = 'fr'): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[lang as keyof typeof value] || value.fr || value.en || value.gasy || '';
};

export default function AdminContentApproval() {
  // Dialogs
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<PendingChapter | null>(null);

  // Edition story
  const [editStoryMode, setEditStoryMode] = useState(false);
  const [editStoryTitle, setEditStoryTitle] = useState('');
  const [editStorySynopsis, setEditStorySynopsis] = useState('');
  const [editStoryGenreId, setEditStoryGenreId] = useState<number | undefined>(undefined);
  const [editStoryIsPremium, setEditStoryIsPremium] = useState(false);
  useEffect(() => {
    if (selectedStory && editStoryMode) {
      setEditStoryTitle(getText(selectedStory.title));
      setEditStorySynopsis(getText(selectedStory.synopsis));
      setEditStoryGenreId(selectedStory.genre?.id);
      setEditStoryIsPremium(selectedStory.is_premium);
    }
  }, [selectedStory, editStoryMode]);

  const handleSaveStoryEdit = async () => {
    if (!selectedStory) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/content/stories/${selectedStory.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: { fr: editStoryTitle },
            synopsis: { fr: editStorySynopsis },
            genre_id: editStoryGenreId,
            is_premium: editStoryIsPremium
          })
        }
      );
      const data = await response.json();
      if (data.success) {
        setSelectedStory(data.data);
        setEditStoryMode(false);
        loadPendingStories();
      } else {
        alert(data.message || 'Erreur lors de la modification');
      }
    } catch (error) {
      alert('Erreur lors de la modification');
    }
    setIsSubmitting(false);
  };

  // Edition chapitre
  const [editChapterMode, setEditChapterMode] = useState(false);
  const [editChapterTitle, setEditChapterTitle] = useState('');
  const [editChapterContent, setEditChapterContent] = useState('');
  useEffect(() => {
    if (selectedChapter && editChapterMode) {
      setEditChapterTitle(getText(selectedChapter.title));
      setEditChapterContent(getText(selectedChapter.content));
    }
  }, [selectedChapter, editChapterMode]);

  const handleSaveChapterEdit = async () => {
    if (!selectedChapter) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/content/chapters/${selectedChapter.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: { fr: editChapterTitle },
            content: { fr: editChapterContent }
          })
        }
      );
      const data = await response.json();
      if (data.success) {
        setSelectedChapter(data.data);
        setEditChapterMode(false);
        loadPendingChapters();
      } else {
        alert(data.message || 'Erreur lors de la modification');
      }
    } catch (error) {
      alert('Erreur lors de la modification');
    }
    setIsSubmitting(false);
  };
  const { token } = useAdmin();
  const [activeTab, setActiveTab] = useState('stories');
  
  // Stories state
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [storiesLoading, setStoriesLoading] = useState(true);
  const [storiesPagination, setStoriesPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  
  // Chapters state
  const [chapters, setChapters] = useState<PendingChapter[]>([]);
  const [chaptersLoading, setChaptersLoading] = useState(true);
  const [chaptersPagination, setChaptersPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  
  // Dialogs
  // ...existing code...
  const [showStoryDialog, setShowStoryDialog] = useState(false);
  const [showChapterDialog, setShowChapterDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectType, setRejectType] = useState<'story' | 'chapter'>('story');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Pending count
  const [pendingCount, setPendingCount] = useState({ stories: 0, chapters: 0 });

  useEffect(() => {
    loadPendingCount();
  }, []);

  useEffect(() => {
    if (activeTab === 'stories') {
      loadPendingStories();
    } else {
      loadPendingChapters();
    }
  }, [activeTab, storiesPagination.page, chaptersPagination.page]);

  const loadPendingCount = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/content/pending-count`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const data = await response.json();
      if (data.success) {
        setPendingCount({
          stories: data.data.pending_stories,
          chapters: data.data.pending_chapters
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement du compteur:', error);
    }
  };

  const loadPendingStories = async () => {
    try {
      setStoriesLoading(true);
      const params = new URLSearchParams({
        page: storiesPagination.page.toString(),
        limit: storiesPagination.limit.toString()
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/content/stories?${params}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      const data = await response.json();
      if (data.success) {
        setStories(data.data.stories);
        setStoriesPagination(prev => ({
          ...prev,
          total: data.data.pagination.total,
          totalPages: data.data.pagination.totalPages
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des stories:', error);
    } finally {
      setStoriesLoading(false);
    }
  };

  const loadPendingChapters = async () => {
    try {
      setChaptersLoading(true);
      const params = new URLSearchParams({
        page: chaptersPagination.page.toString(),
        limit: chaptersPagination.limit.toString()
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/content/chapters?${params}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      const data = await response.json();
      if (data.success) {
        setChapters(data.data.chapters);
        setChaptersPagination(prev => ({
          ...prev,
          total: data.data.pagination.total,
          totalPages: data.data.pagination.totalPages
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des chapitres:', error);
    } finally {
      setChaptersLoading(false);
    }
  };

  const loadStoryDetails = async (storyId: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/content/stories/${storyId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const data = await response.json();
      if (data.success) {
        setSelectedStory(data.data);
        setShowStoryDialog(true);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la story:', error);
    }
  };

  const loadChapterDetails = async (chapterId: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/content/chapters/${chapterId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const data = await response.json();
      if (data.success) {
        setSelectedChapter(data.data);
        setShowChapterDialog(true);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du chapitre:', error);
    }
  };

  const handleApproveStory = async () => {
    if (!selectedStory) return;
    try {
      setIsSubmitting(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/content/stories/${selectedStory.id}/approve`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      const data = await response.json();
      if (data.success) {
        setShowStoryDialog(false);
        setSelectedStory(null);
        loadPendingStories();
        loadPendingCount();
      } else {
        alert(data.message || 'Erreur lors de l\'approbation');
      }
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      alert('Erreur lors de l\'approbation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveChapter = async () => {
    if (!selectedChapter) return;
    try {
      setIsSubmitting(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/content/chapters/${selectedChapter.id}/approve`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      const data = await response.json();
      if (data.success) {
        setShowChapterDialog(false);
        setSelectedChapter(null);
        loadPendingChapters();
        loadPendingCount();
      } else {
        alert(data.message || 'Erreur lors de l\'approbation');
      }
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      alert('Erreur lors de l\'approbation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openRejectDialog = (type: 'story' | 'chapter') => {
    setRejectType(type);
    setRejectionReason('');
    setShowRejectDialog(true);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Veuillez indiquer la raison du rejet');
      return;
    }

    try {
      setIsSubmitting(true);
      const id = rejectType === 'story' ? selectedStory?.id : selectedChapter?.id;
      const endpoint = rejectType === 'story' 
        ? `${import.meta.env.VITE_API_URL}/api/admin/content/stories/${id}/reject`
        : `${import.meta.env.VITE_API_URL}/api/admin/content/chapters/${id}/reject`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rejection_reason: rejectionReason })
      });

      const data = await response.json();
      if (data.success) {
        setShowRejectDialog(false);
        if (rejectType === 'story') {
          setShowStoryDialog(false);
          setSelectedStory(null);
          loadPendingStories();
        } else {
          setShowChapterDialog(false);
          setSelectedChapter(null);
          loadPendingChapters();
        }
        loadPendingCount();
      } else {
        alert(data.message || 'Erreur lors du rejet');
      }
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      alert('Erreur lors du rejet');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Validation du Contenu</h1>
          <p className="text-muted-foreground">
            Gérez les stories et chapitres en attente de validation
          </p>
        </div>

        {/* Compteurs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Stories en attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-orange-500" />
                <span className="text-2xl font-bold">{pendingCount.stories}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Chapitres en attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold">{pendingCount.chapters}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold">{pendingCount.stories + pendingCount.chapters}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="stories" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Stories ({pendingCount.stories})
            </TabsTrigger>
            <TabsTrigger value="chapters" className="gap-2">
              <FileText className="h-4 w-4" />
              Chapitres ({pendingCount.chapters})
            </TabsTrigger>
          </TabsList>

          {/* Stories Tab */}
          <TabsContent value="stories" className="space-y-4">
            {storiesLoading ? (
              <div className="text-center py-8">Chargement...</div>
            ) : stories.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  Aucune story en attente de validation
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid gap-4">
                  {stories.map((story) => (
                    <Card key={story.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {story.cover_image && (
                            <img 
                              src={story.cover_image} 
                              alt={getText(story.title)} 
                              className="w-20 h-28 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-semibold text-lg truncate">
                                  {getText(story.title)}
                                </h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {story.author?.pseudo || 'Auteur inconnu'}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {story.is_premium && (
                                  <Badge variant="secondary">Premium</Badge>
                                )}
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                  <Clock className="h-3 w-3 mr-1" />
                                  En attente
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {getText(story.synopsis) || 'Pas de synopsis'}
                            </p>
                            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {story.chapters_count} chapitres
                              </span>
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                {getText(story.genre?.title)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {story.submitted_at ? formatDate(story.submitted_at) : formatDate(story.created_at)}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => loadStoryDetails(story.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Voir
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {storiesPagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={storiesPagination.page <= 1}
                      onClick={() => setStoriesPagination(p => ({ ...p, page: p.page - 1 }))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="flex items-center px-3 text-sm">
                      Page {storiesPagination.page} / {storiesPagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={storiesPagination.page >= storiesPagination.totalPages}
                      onClick={() => setStoriesPagination(p => ({ ...p, page: p.page + 1 }))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Chapters Tab */}
          <TabsContent value="chapters" className="space-y-4">
            {chaptersLoading ? (
              <div className="text-center py-8">Chargement...</div>
            ) : chapters.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  Aucun chapitre en attente de validation
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid gap-4">
                  {chapters.map((chapter) => (
                    <Card key={chapter.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">Chap. {chapter.chapter_number}</Badge>
                              <h3 className="font-semibold">{getText(chapter.title)}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Story: {getText(chapter.story?.title)}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <User className="h-3 w-3" />
                              {chapter.story?.author?.pseudo || 'Auteur inconnu'}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {chapter.submitted_at ? formatDate(chapter.submitted_at) : formatDate(chapter.created_at)}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              <Clock className="h-3 w-3 mr-1" />
                              En attente
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => loadChapterDetails(chapter.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Voir
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {chaptersPagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={chaptersPagination.page <= 1}
                      onClick={() => setChaptersPagination(p => ({ ...p, page: p.page - 1 }))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="flex items-center px-3 text-sm">
                      Page {chaptersPagination.page} / {chaptersPagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={chaptersPagination.page >= chaptersPagination.totalPages}
                      onClick={() => setChaptersPagination(p => ({ ...p, page: p.page + 1 }))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Story Detail Dialog */}
      <Dialog open={showStoryDialog} onOpenChange={setShowStoryDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Validation de l'histoire
            </DialogTitle>
            <DialogDescription>
              Examinez le contenu et décidez de l'approuver ou le rejeter
            </DialogDescription>
          </DialogHeader>
          
          {selectedStory && (
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6">
                {/* Story Info */}
                <div className="flex gap-4">
                  {selectedStory.cover_image && (
                    <img 
                      src={selectedStory.cover_image} 
                      alt={getText(selectedStory.title)} 
                      className="w-32 h-44 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    {editStoryMode ? (
                      <>
                        <Label htmlFor="editStoryTitle">Titre</Label>
                        <Input
                          id="editStoryTitle"
                          value={editStoryTitle}
                          onChange={e => setEditStoryTitle(e.target.value)}
                          className="mb-2"
                        />
                        <Label htmlFor="editStorySynopsis">Synopsis</Label>
                        <Textarea
                          id="editStorySynopsis"
                          value={editStorySynopsis}
                          onChange={e => setEditStorySynopsis(e.target.value)}
                          className="mb-2"
                        />
                        <div className="flex gap-2 mb-2 items-center">
                          <Label htmlFor="editStoryGenreId">Genre</Label>
                          <Input
                            id="editStoryGenreId"
                            type="number"
                            value={editStoryGenreId ?? ''}
                            onChange={e => setEditStoryGenreId(Number(e.target.value))}
                            className="w-24"
                          />
                          <Label htmlFor="editStoryIsPremium">Premium</Label>
                          <input
                            id="editStoryIsPremium"
                            type="checkbox"
                            checked={editStoryIsPremium}
                            onChange={e => setEditStoryIsPremium(e.target.checked)}
                          />
                        </div>
                        <Button size="sm" variant="default" onClick={handleSaveStoryEdit} disabled={isSubmitting} className="mr-2">Sauvegarder</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditStoryMode(false)}>Annuler</Button>
                      </>
                    ) : (
                      <>
                        <h2 className="text-xl font-bold">{getText(selectedStory.title)}</h2>
                        <p className="text-muted-foreground">{getText(selectedStory.synopsis)}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge>{getText(selectedStory.genre?.title)}</Badge>
                          {selectedStory.is_premium && <Badge variant="secondary">Premium</Badge>}
                          <Badge variant="outline">{selectedStory.chapters_count} chapitres</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p><strong>Auteur:</strong> {selectedStory.author?.pseudo} ({selectedStory.author?.email})</p>
                          <p><strong>Soumis le:</strong> {selectedStory.submitted_at ? formatDate(selectedStory.submitted_at) : 'N/A'}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => setEditStoryMode(true)} className="mt-2"><Edit className="h-4 w-4 mr-1" /> Modifier</Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Chapters */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Chapitres ({selectedStory.chapters?.length || 0})
                  </h3>
                  <div className="space-y-3">
                    {selectedStory.chapters?.map((chapter) => (
                      <Card key={chapter.id}>
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Badge variant="outline">Chap. {chapter.chapter_number}</Badge>
                            {getText(chapter.title)}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                          <div className="text-sm text-muted-foreground max-h-32 overflow-y-auto whitespace-pre-wrap">
                            {getText(chapter.content).substring(0, 500)}
                            {getText(chapter.content).length > 500 && '...'}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}

          <DialogFooter className="gap-2 pt-4 border-t">
            <Button
              variant="destructive"
              onClick={() => openRejectDialog('story')}
              disabled={isSubmitting}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Rejeter
            </Button>
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={handleApproveStory}
              disabled={isSubmitting}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              {isSubmitting ? 'Approbation...' : 'Approuver'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chapter Detail Dialog */}
      <Dialog open={showChapterDialog} onOpenChange={setShowChapterDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Validation du chapitre
            </DialogTitle>
            <DialogDescription>
              Examinez le contenu et décidez de l'approuver ou le rejeter
            </DialogDescription>
          </DialogHeader>
          
          {selectedChapter && (
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                <div>
                  <Badge variant="secondary" className="mb-2">Chapitre {selectedChapter.chapter_number}</Badge>
                  {editChapterMode ? (
                    <>
                      <Label htmlFor="editChapterTitle">Titre</Label>
                      <Input
                        id="editChapterTitle"
                        value={editChapterTitle}
                        onChange={e => setEditChapterTitle(e.target.value)}
                        className="mb-2"
                      />
                      <Label htmlFor="editChapterContent">Contenu</Label>
                      <Textarea
                        id="editChapterContent"
                        value={editChapterContent}
                        onChange={e => setEditChapterContent(e.target.value)}
                        rows={6}
                        className="mb-2"
                      />
                      <Button size="sm" variant="default" onClick={handleSaveChapterEdit} disabled={isSubmitting} className="mr-2">Sauvegarder</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditChapterMode(false)}>Annuler</Button>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold">{getText(selectedChapter.title)}</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Story: {getText(selectedChapter.story?.title)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Auteur: {selectedChapter.story?.author?.pseudo}
                      </p>
                      <Button size="sm" variant="outline" onClick={() => setEditChapterMode(true)} className="mt-2"><Edit className="h-4 w-4 mr-1" /> Modifier</Button>
                    </>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Contenu</h3>
                  {!editChapterMode && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                          {getText(selectedChapter.content)}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}

          <DialogFooter className="gap-2 pt-4 border-t">
            <Button
              variant="destructive"
              onClick={() => openRejectDialog('chapter')}
              disabled={isSubmitting}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Rejeter
            </Button>
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={handleApproveChapter}
              disabled={isSubmitting}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              {isSubmitting ? 'Approbation...' : 'Approuver'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Rejeter {rejectType === 'story' ? 'l\'histoire' : 'le chapitre'}
            </DialogTitle>
            <DialogDescription>
              Indiquez la raison du rejet. L'auteur sera notifié et pourra modifier son contenu.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rejection_reason">Raison du rejet *</Label>
              <Textarea
                id="rejection_reason"
                placeholder="Ex: Le contenu ne respecte pas nos directives..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isSubmitting || !rejectionReason.trim()}
            >
              {isSubmitting ? 'Rejet...' : 'Confirmer le rejet'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
