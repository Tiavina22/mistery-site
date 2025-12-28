import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import CreatorLayout from '@/components/CreatorLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Heart, MessageCircle, UserPlus, BookOpen } from 'lucide-react';

export default function CreatorNotifications() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/creator/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <CreatorLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Bell className="h-12 w-12 animate-pulse mx-auto mb-4 text-[#1DB954]" />
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
            <div className="flex items-center gap-3 mb-2">
              <Bell className="w-10 h-10 text-[#1DB954]" />
              <div>
                <h1 className="text-5xl font-bold text-white">Notifications</h1>
                <p className="text-gray-400 text-lg">Restez informé de votre activité</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Empty State */}
            <Card className="bg-[#181818] border-none">
              <CardContent className="py-16">
                <div className="text-center">
                  <Bell className="h-20 w-20 mx-auto mb-4 text-gray-600" />
                  <h3 className="text-2xl font-bold mb-2 text-white">Aucune notification</h3>
                  <p className="text-gray-400 mb-6 text-lg">
                    Vous n'avez pas encore de notifications
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Example Notifications (hidden for now) */}
            <div className="hidden space-y-3">
              {/* Like Notification */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-[#181818] hover:bg-[#282828] transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold mb-1">
                    Nouvelle réaction sur votre histoire
                  </p>
                  <p className="text-gray-400 text-sm mb-2">
                    "Titre de l'histoire" a reçu 5 nouveaux likes
                  </p>
                  <p className="text-gray-500 text-xs">Il y a 2 heures</p>
                </div>
              </div>

              {/* Comment Notification */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-[#181818] hover:bg-[#282828] transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold mb-1">
                    Nouveau commentaire
                  </p>
                  <p className="text-gray-400 text-sm mb-2">
                    Un lecteur a commenté "Titre de l'histoire - Chapitre 1"
                  </p>
                  <p className="text-gray-500 text-xs">Il y a 5 heures</p>
                </div>
              </div>

              {/* Follower Notification */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-[#181818] hover:bg-[#282828] transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <UserPlus className="w-6 h-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold mb-1">
                    Nouvel abonné
                  </p>
                  <p className="text-gray-400 text-sm mb-2">
                    3 nouvelles personnes suivent votre profil
                  </p>
                  <p className="text-gray-500 text-xs">Hier</p>
                </div>
              </div>

              {/* Story Published */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-[#181818] hover:bg-[#282828] transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold mb-1">
                    Histoire publiée avec succès
                  </p>
                  <p className="text-gray-400 text-sm mb-2">
                    "Titre de l'histoire" est maintenant visible par tous
                  </p>
                  <p className="text-gray-500 text-xs">Il y a 2 jours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CreatorLayout>
  );
}
