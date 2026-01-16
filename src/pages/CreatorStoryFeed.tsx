import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authorApi } from '@/lib/api';
import CreatorLayout from '@/components/CreatorLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, 
  Heart, 
  MessageCircle, 
  Eye, 
  Send,
  ChevronDown,
  ChevronUp,
  User
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500';

interface Comment {
  id: number;
  comment_text: string;
  created_at: string;
  user?: {
    id: number;
    username: string;
    email: string;
    avatar?: string;
  };
  author?: {
    id: number;
    pseudo: string;
    email: string;
    avatar?: string;
  };
  replies?: Comment[];
}

interface Story {
  id: number;
  title: any;
  synopsis?: any;
  cover_image?: string;
  status: string;
  view_count: number;
  reaction_count: number;
  comment_count: number;
  created_at: string;
  genre?: { title: string };
}

export default function CreatorStoryFeed() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: isAuthLoading, author } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedStory, setExpandedStory] = useState<number | null>(null);
  const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});
  const [loadingComments, setLoadingComments] = useState<{ [key: number]: boolean }>({});
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [replyTo, setReplyTo] = useState<{ storyId: number; commentId: number; username: string } | null>(null);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate('/creator/login');
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated && author?.id) {
      loadStories();
    }
  }, [isAuthenticated, author?.id]);

  const loadStories = async () => {
    if (!author?.id) return;
    
    try {
      setIsLoading(true);
      const response = await authorApi.getStories(author.id);
      const publishedStories = (response.data.data || []).filter((s: Story) => s.status === 'published');
      setStories(publishedStories);
    } catch (error) {
      console.error('Erreur chargement stories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadComments = async (storyId: number) => {
    if (comments[storyId]) {
      return; // Déjà chargés
    }

    setLoadingComments(prev => ({ ...prev, [storyId]: true }));
    try {
      const token = localStorage.getItem('author_token');
      const response = await fetch(`${API_BASE_URL}/api/reactions/stories/${storyId}/comments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setComments(prev => ({ ...prev, [storyId]: data.data.comments || [] }));
      }
    } catch (error) {
      console.error('Erreur chargement commentaires:', error);
    } finally {
      setLoadingComments(prev => ({ ...prev, [storyId]: false }));
    }
  };

  const toggleStoryExpansion = (storyId: number) => {
    if (expandedStory === storyId) {
      setExpandedStory(null);
    } else {
      setExpandedStory(storyId);
      loadComments(storyId);
    }
  };

  const handleAddComment = async (storyId: number, parentCommentId?: number) => {
    const commentText = newComment[storyId]?.trim();
    if (!commentText) return;

    setSubmittingComment(true);
    try {
      const token = localStorage.getItem('author_token');
      const response = await fetch(`${API_BASE_URL}/api/reactions/stories/${storyId}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          commentText,
          parentCommentId: parentCommentId || null
        })
      });

      const data = await response.json();
      if (data.success) {
        // Recharger les commentaires
        setComments(prev => ({ ...prev, [storyId]: [] }));
        await loadComments(storyId);
        setNewComment(prev => ({ ...prev, [storyId]: '' }));
        setReplyTo(null);

        // TODO: Envoyer notification au user
      }
    } catch (error) {
      console.error('Erreur ajout commentaire:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const getStoryTitle = (title: any) => {
    if (typeof title === 'string') return title;
    return title?.gasy || title?.fr || title?.en || 'Sans titre';
  };

  const getStorySynopsis = (synopsis: any) => {
    if (!synopsis) return '';
    if (typeof synopsis === 'string') return synopsis;
    return synopsis?.gasy || synopsis?.fr || synopsis?.en || '';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'À l\'instant';
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return date.toLocaleDateString('fr-FR');
  };

  const getAvatarSrc = (avatar?: string): string | undefined => {
    if (!avatar) return undefined;
    if (avatar.startsWith('data:') || avatar.startsWith('http://') || avatar.startsWith('https://')) {
      return avatar;
    }
    return `data:image/jpeg;base64,${avatar}`;
  };

  if (isAuthLoading || isLoading) {
    return (
      <CreatorLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <BookOpen className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </CreatorLayout>
    );
  }

  return (
    <CreatorLayout>
      <div className="h-full overflow-auto bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-secondary to-background border-b border-border">
          <div className="px-8 py-8">
            <div className="flex items-center gap-3 mb-2">
              <MessageCircle className="w-10 h-10 text-[#1DB954]" />
              <div>
                <h1 className="text-5xl font-bold text-foreground">Mes Publications</h1>
                <p className="text-muted-foreground text-lg">Gérez les interactions avec vos lecteurs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8 max-w-4xl mx-auto space-y-6">
          {stories.length === 0 ? (
            <Card className="bg-card border-none">
              <CardContent className="py-12 text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2 text-foreground">Aucune histoire publiée</h3>
                <p className="text-muted-foreground">Publiez des histoires pour voir les interactions</p>
              </CardContent>
            </Card>
          ) : (
            stories.map((story) => (
              <Card key={story.id} className="bg-card border-none overflow-hidden">
                {/* Story Header */}
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    {story.cover_image && (
                      <img 
                        src={story.cover_image} 
                        alt={getStoryTitle(story.title)} 
                        className="w-20 h-28 object-cover rounded-lg shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <CardTitle className="text-xl font-bold text-foreground mb-1">
                            {getStoryTitle(story.title)}
                          </CardTitle>
                          <CardDescription className="text-sm text-muted-foreground">
                            {formatDate(story.created_at)} • {story.genre?.title}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="shrink-0">Publié</Badge>
                      </div>
                      {getStorySynopsis(story.synopsis) && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {getStorySynopsis(story.synopsis)}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {/* Stats */}
                <CardContent className="pt-0">
                  <div className="flex items-center gap-6 py-3 border-y border-border">
                    <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-500 transition-colors">
                      <Eye className="w-5 h-5" />
                      <span className="font-semibold">{story.view_count || 0}</span>
                      <span>vues</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-red-500 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="font-semibold">{story.reaction_count || 0}</span>
                      <span>j'aime</span>
                    </button>
                    <button 
                      onClick={() => toggleStoryExpansion(story.id)}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#1DB954] transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-semibold">{story.comment_count || 0}</span>
                      <span>commentaires</span>
                      {expandedStory === story.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Comments Section */}
                  {expandedStory === story.id && (
                    <div className="mt-4 space-y-4">
                      {/* Add Comment */}
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10 shrink-0">
                          {author?.avatar ? (
                            <AvatarImage src={author.avatar} alt={author.pseudo} />
                          ) : (
                            <AvatarFallback className="bg-[#1DB954] text-black">
                              {author?.pseudo?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1">
                          {replyTo && replyTo.storyId === story.id && (
                            <div className="mb-2 text-sm text-muted-foreground">
                              Réponse à <span className="font-semibold">@{replyTo.username}</span>
                              <button onClick={() => setReplyTo(null)} className="ml-2 text-red-500 hover:underline">
                                Annuler
                              </button>
                            </div>
                          )}
                          <Textarea
                            placeholder={replyTo?.storyId === story.id ? "Écrivez votre réponse..." : "Ajoutez un commentaire..."}
                            value={newComment[story.id] || ''}
                            onChange={(e) => setNewComment(prev => ({ ...prev, [story.id]: e.target.value }))}
                            className="min-h-[80px] resize-none"
                          />
                          <div className="flex justify-end mt-2">
                            <Button
                              onClick={() => handleAddComment(story.id, replyTo?.storyId === story.id ? replyTo.commentId : undefined)}
                              disabled={!newComment[story.id]?.trim() || submittingComment}
                              className="bg-[#1DB954] hover:bg-[#1ed760]"
                              size="sm"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              {submittingComment ? 'Envoi...' : 'Envoyer'}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Comments List */}
                      {loadingComments[story.id] ? (
                        <div className="text-center py-4 text-muted-foreground">
                          Chargement des commentaires...
                        </div>
                      ) : (
                        <ScrollArea className="max-h-[500px]">
                          <div className="space-y-4">
                            {(comments[story.id] || []).map((comment) => (
                              <div key={comment.id} className="space-y-3">
                                {/* Main Comment */}
                                <div className="flex items-start gap-3">
                                  <Avatar className="w-8 h-8 shrink-0">
                                    {(comment.user?.avatar || comment.author?.avatar) ? (
                                      <AvatarImage src={getAvatarSrc(comment.user?.avatar || comment.author?.avatar || '')} alt={comment.user?.username || comment.author?.pseudo} />
                                    ) : (
                                      <AvatarFallback>
                                        <User className="w-4 h-4" />
                                      </AvatarFallback>
                                    )}
                                  </Avatar>
                                  <div className="flex-1 bg-secondary rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold text-sm text-foreground">{comment.user?.username || comment.author?.pseudo}</span>
                                      {comment.author && <Badge variant="secondary" className="text-xs">Créateur</Badge>}
                                      <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
                                    </div>
                                    <p className="text-sm text-foreground whitespace-pre-wrap">{comment.comment_text}</p>
                                    <button
                                      onClick={() => setReplyTo({ storyId: story.id, commentId: comment.id, username: comment.user?.username || comment.author?.pseudo || 'Utilisateur' })}
                                      className="text-xs text-[#1DB954] hover:underline mt-2"
                                    >
                                      Répondre
                                    </button>
                                  </div>
                                </div>

                                {/* Replies */}
                                {comment.replies && comment.replies.length > 0 && (
                                  <div className="ml-11 space-y-3">
                                    {comment.replies.map((reply) => (
                                      <div key={reply.id} className="flex items-start gap-3">
                                        <Avatar className="w-8 h-8 shrink-0">
                                          {(reply.user?.avatar || reply.author?.avatar) ? (
                                            <AvatarImage src={getAvatarSrc(reply.user?.avatar || reply.author?.avatar || '')} alt={reply.user?.username || reply.author?.pseudo} />
                                          ) : (
                                            <AvatarFallback>
                                              <User className="w-4 h-4" />
                                            </AvatarFallback>
                                          )}
                                        </Avatar>
                                        <div className="flex-1 bg-secondary/50 rounded-lg p-3">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-sm text-foreground">{reply.user?.username || reply.author?.pseudo}</span>
                                            {reply.author && <Badge variant="secondary" className="text-xs">Créateur</Badge>}
                                            <span className="text-xs text-muted-foreground">{formatDate(reply.created_at)}</span>
                                          </div>
                                          <p className="text-sm text-foreground whitespace-pre-wrap">{reply.comment_text}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </CreatorLayout>
  );
}
