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
import { ArrowLeft, Video, Loader2, Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Genre {
  id: number;
  title: string;
}

export default function CreateVideo() {
  const navigate = useNavigate();
  const { author, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [kycInfo, setKycInfo] = useState<any>(null);
  const [loadingKyc, setLoadingKyc] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    synopsis: '',
    genre_id: '',
    video_url: '',
    thumbnail_image: '',
    duration: '',
    is_premium: false,
    language: 'fr',
    quality: '',
    tags: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/creator/login');
      return;
    }

    loadGenres();
    loadKycInfo();
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

  const loadKycInfo = async () => {
    if (!author) return;

    try {
      setLoadingKyc(true);
      const token = localStorage.getItem('author_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/authors/${author.id}/kyc`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('KYC Response Status:', response.status);
      console.log('KYC Response Data:', data);
      
      if (response.ok && data.success) {
        setKycInfo(data.data);
      } else if (response.status === 404) {
        console.log('KYC not found - user needs to submit KYC');
        setKycInfo(null);
      } else {
        console.log('KYC fetch failed:', data.message);
        setKycInfo(null);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du KYC:', error);
      setKycInfo(null);
    } finally {
      setLoadingKyc(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérifier le statut KYC
    if (!kycInfo || kycInfo.kyc_status !== 'valide') {
      toast({
        title: 'KYC requis',
        description: 'Votre KYC doit être validé pour créer des vidéos',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.title || !formData.video_url || !formData.duration) {
      toast({
        title: 'Erreur',
        description: 'Le titre, l\'URL de la vidéo et la durée sont requis',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);

      const token = localStorage.getItem('author_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          synopsis: formData.synopsis || null,
          genre_id: formData.genre_id ? parseInt(formData.genre_id) : null,
          video_url: formData.video_url,
          thumbnail_image: formData.thumbnail_image || null,
          duration: parseInt(formData.duration),
          is_premium: formData.is_premium,
          language: formData.language,
          quality: formData.quality || null,
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Erreur lors de la création');
      }

      toast({
        title: 'Succès',
        description: 'Vidéo créée avec succès',
      });

      navigate('/creator/videos');
    } catch (error: any) {
      console.error('Erreur lors de la création de la vidéo:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors de la création de la vidéo',
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

  // Afficher un message si le KYC n'est pas validé
  if (loadingKyc) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        </div>
      </div>
    );
  }

  const kycStatus = kycInfo?.kyc_status;
  const isKycValidated = kycStatus === 'valide'; // Valeur de la BD

  if (!isKycValidated) {
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
            <CardContent className="pt-6">
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-3">
                    <p className="font-semibold">Votre KYC doit être validé pour créer des vidéos</p>
                    
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Statut actuel : </span>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          kycStatus === 'valide' ? 'bg-green-100 text-green-800' :
                          kycStatus === 'en_verification' ? 'bg-yellow-100 text-yellow-800' :
                          kycStatus === 'rejete' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {kycStatus === 'valide' && 'Validé ✓'}
                          {kycStatus === 'en_verification' && 'En vérification ⏳'}
                          {kycStatus === 'rejete' && 'Rejeté ✗'}
                          {!kycStatus && 'Non soumis'}
                        </span>
                      </p>
                    </div>

                    {kycStatus === 'rejete' && kycInfo?.rejection_reason && (
                      <div className="p-2 bg-red-50 border border-red-200 rounded text-sm">
                        <p className="font-medium text-red-700">Raison du rejet:</p>
                        <p className="text-red-600">{kycInfo.rejection_reason}</p>
                      </div>
                    )}

                    {kycStatus === 'en_verification' && (
                      <p className="text-sm text-yellow-700">
                        Votre KYC est en cours de vérification. Veuillez patienter...
                      </p>
                    )}

                    {!kycStatus || kycStatus === 'rejete' && (
                      <Button
                        variant="outline"
                        onClick={() => navigate('/creator/settings')}
                        className="mt-2"
                      >
                        Aller aux paramètres pour soumettre votre KYC
                      </Button>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                <Video className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">Créer une nouvelle vidéo</CardTitle>
                <CardDescription>
                  Partagez vos créations vidéo avec votre audience
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
                  placeholder="Le titre de votre vidéo"
                  required
                />
              </div>

              {/* Synopsis */}
              <div className="space-y-2">
                <Label htmlFor="synopsis">Description</Label>
                <Textarea
                  id="synopsis"
                  value={formData.synopsis}
                  onChange={(e) => handleChange('synopsis', e.target.value)}
                  placeholder="Décrivez votre vidéo..."
                  rows={4}
                />
              </div>

              {/* URL de la vidéo */}
              <div className="space-y-2">
                <Label htmlFor="video_url">
                  URL de la vidéo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="video_url"
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => handleChange('video_url', e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  URL de votre vidéo hébergée (YouTube, Vimeo, ou lien direct)
                </p>
              </div>

              {/* Image miniature */}
              <div className="space-y-2">
                <Label htmlFor="thumbnail_image">Image miniature (URL)</Label>
                <Input
                  id="thumbnail_image"
                  type="url"
                  value={formData.thumbnail_image}
                  onChange={(e) => handleChange('thumbnail_image', e.target.value)}
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>

              {/* Durée */}
              <div className="space-y-2">
                <Label htmlFor="duration">
                  Durée (en secondes) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', e.target.value)}
                  placeholder="180"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Durée totale de la vidéo en secondes (ex: 180 = 3 minutes)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Genre */}
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Select
                    value={formData.genre_id}
                    onValueChange={(value) => handleChange('genre_id', value)}
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

                {/* Langue */}
                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) => handleChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une langue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="mg">Malagasy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Qualité */}
                <div className="space-y-2">
                  <Label htmlFor="quality">Qualité</Label>
                  <Select
                    value={formData.quality}
                    onValueChange={(value) => handleChange('quality', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez la qualité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SD">SD (480p)</SelectItem>
                      <SelectItem value="HD">HD (720p)</SelectItem>
                      <SelectItem value="Full HD">Full HD (1080p)</SelectItem>
                      <SelectItem value="4K">4K (2160p)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  placeholder="action, aventure, suspense"
                />
                <p className="text-xs text-muted-foreground">
                  Séparez les tags par des virgules
                </p>
              </div>

              {/* Premium */}
              <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="is_premium" className="text-base">
                    Contenu Premium
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Cette vidéo sera accessible uniquement aux abonnés premium
                  </p>
                </div>
                <Switch
                  id="is_premium"
                  checked={formData.is_premium}
                  onCheckedChange={(checked) => handleChange('is_premium', checked)}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
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
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Créer la vidéo
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
