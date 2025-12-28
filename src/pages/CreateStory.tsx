import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { storyApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, BookOpen, Loader2 } from 'lucide-react';

interface Genre {
  id: number;
  title: string;
}

export default function CreateStory() {
  const navigate = useNavigate();
  const { author, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    synopsis: '',
    genre_id: '',
    is_premium: false,
    cover_image: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/creator/login');
      return;
    }

    loadGenres();
  }, [isAuthenticated, navigate]);

  const loadGenres = async () => {
    try {
      const response = await storyApi.getGenres();
      setGenres(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des genres:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les genres',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.genre_id) {
      toast({
        title: 'Erreur',
        description: 'Le titre et le genre sont requis',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);

      const response = await storyApi.createStory({
        title: formData.title,
        synopsis: formData.synopsis,
        genre_id: parseInt(formData.genre_id),
        is_premium: formData.is_premium,
        cover_image: formData.cover_image || null
      });

      toast({
        title: 'Succès',
        description: 'Histoire créée avec succès',
      });

      // Rediriger vers le dashboard ou vers l'édition de l'histoire
      navigate('/creator/dashboard');
    } catch (error: any) {
      console.error('Erreur lors de la création de l\'histoire:', error);
      toast({
        title: 'Erreur',
        description: error.response?.data?.message || 'Erreur lors de la création de l\'histoire',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/creator/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au dashboard
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">Créer une nouvelle histoire</CardTitle>
                <CardDescription>
                  Commencez à écrire votre prochaine aventure
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Titre */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Titre <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Le titre de votre histoire"
                  required
                />
              </div>

              {/* Synopsis */}
              <div className="space-y-2">
                <Label htmlFor="synopsis">Synopsis</Label>
                <Textarea
                  id="synopsis"
                  value={formData.synopsis}
                  onChange={(e) => handleChange('synopsis', e.target.value)}
                  placeholder="Décrivez brièvement votre histoire..."
                  rows={5}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Un bon synopsis attire les lecteurs. Donnez-leur envie de découvrir votre histoire.
                </p>
              </div>

              {/* Genre */}
              <div className="space-y-2">
                <Label htmlFor="genre">
                  Genre <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.genre_id}
                  onValueChange={(value) => handleChange('genre_id', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre.id} value={genre.id.toString()}>
                        {genre.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Image de couverture */}
              <div className="space-y-2">
                <Label htmlFor="cover_image">URL de l'image de couverture</Label>
                <Input
                  id="cover_image"
                  type="url"
                  value={formData.cover_image}
                  onChange={(e) => handleChange('cover_image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  Vous pourrez ajouter une image plus tard si vous n'en avez pas maintenant.
                </p>
              </div>

              {/* Histoire premium */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="is_premium" className="text-base">
                    Histoire Premium
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Les histoires premium sont réservées aux abonnés
                  </p>
                </div>
                <Switch
                  id="is_premium"
                  checked={formData.is_premium}
                  onCheckedChange={(checked) => handleChange('is_premium', checked)}
                />
              </div>

              {/* Boutons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/creator/dashboard')}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Créer l'histoire
                    </>
                  )}
                </Button>
              </div>

              <p className="text-sm text-muted-foreground text-center pt-2">
                Votre histoire sera créée en tant que brouillon. Vous pourrez la publier plus tard.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
