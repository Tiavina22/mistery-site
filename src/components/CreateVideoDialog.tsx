import { useState, useEffect } from 'react';
import { storyApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Video, Loader2, AlertCircle, Upload, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Genre {
  id: number;
  title: string;
}

interface CreateVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  kycStatus?: string;
}

export default function CreateVideoDialog({ 
  open, 
  onOpenChange, 
  onSuccess, 
  kycStatus 
}: CreateVideoDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    synopsis: '',
    genre_id: '',
    video_url: '',
    duration: '',
    is_premium: false,
    language: 'fr',
    quality: '',
    tags: ''
  });

  console.log('CreateVideoDialog - kyc_status:', kycStatus);

  useEffect(() => {
    if (open) {
      loadGenres();
      // Réinitialiser le formulaire
      setFormData({
        title: '',
        synopsis: '',
        genre_id: '',
        video_url: '',
        duration: '',
        is_premium: false,
        language: 'fr',
        quality: '',
        tags: ''
      });
      setThumbnailFile(null);
      setThumbnailPreview('');
    }
  }, [open]);

  const loadGenres = async () => {
    try {
      const response = await storyApi.getGenres();
      setGenres(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des genres:', error);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner une image valide',
        variant: 'destructive',
      });
      return;
    }

    // Vérifier la taille (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'Erreur',
        description: 'L\'image ne doit pas dépasser 10MB',
        variant: 'destructive',
      });
      return;
    }

    setThumbnailFile(file);

    // Créer un aperçu
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérifier le KYC
    if (kycStatus !== 'valide') {
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
          thumbnail_image: thumbnailPreview || null,
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

      onOpenChange(false);
      onSuccess();
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

  const isKycValid = kycStatus === 'valide';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Créer une nouvelle vidéo
          </DialogTitle>
          <DialogDescription>
            Partagez vos créations vidéo avec votre audience
          </DialogDescription>
        </DialogHeader>

        {!isKycValid && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Votre KYC doit être validé pour créer des vidéos. Statut actuel : <strong>{kycStatus || 'Non soumis'}</strong>
            </AlertDescription>
          </Alert>
        )}

        {isKycValid && (
          <form onSubmit={handleSubmit} className="space-y-4">
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
                disabled={isLoading}
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
                rows={3}
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            {/* Durée */}
            <div className="space-y-2">
              <Label htmlFor="duration">
                Durée (secondes) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration || ''}
                onChange={(e) => handleChange('duration', e.target.value)}
                placeholder="180"
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Genre */}
              <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                <Select
                  value={formData.genre_id}
                  onValueChange={(value) => handleChange('genre_id', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez..." />
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

              {/* Qualité */}
              <div className="space-y-2">
                <Label htmlFor="quality">Qualité</Label>
                <Select
                  value={formData.quality}
                  onValueChange={(value) => handleChange('quality', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez..." />
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

            {/* Image miniature */}
            <div className="space-y-2">
              <Label htmlFor="thumbnail" className="text-foreground">Image miniature</Label>
              {!thumbnailPreview ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 transition-colors"
                  onClick={() => document.getElementById('thumbnail')?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Cliquez pour uploader</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG (max 10MB)</p>
                  <input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={thumbnailPreview}
                    alt="Aperçu miniature"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>

            {/* Premium */}
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="is_premium" className="text-sm font-medium">
                  Contenu Premium
                </Label>
                <p className="text-xs text-muted-foreground">
                  Accessible uniquement aux abonnés
                </p>
              </div>
              <Switch
                id="is_premium"
                checked={formData.is_premium}
                onCheckedChange={(checked) => handleChange('is_premium', checked)}
                disabled={isLoading}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Video className="mr-2 h-4 w-4" />
                    Créer la vidéo
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
