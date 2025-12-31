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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Loader2, X } from 'lucide-react';

interface Genre {
  id: number;
  title: string;
}

interface Story {
  id: number;
  title: any;
  synopsis: any;
  genre_id: number;
  is_premium: boolean;
  cover_image?: string;
}

interface CreateStoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  storyToEdit?: Story | null;
}

export default function CreateStoryDialog({ open, onOpenChange, onSuccess, storyToEdit }: CreateStoryDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  
  const [formData, setFormData] = useState({
    title_gasy: '',
    title_fr: '',
    title_en: '',
    synopsis_gasy: '',
    synopsis_fr: '',
    synopsis_en: '',
    genre_id: '',
    is_premium: false,
  });
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');

  useEffect(() => {
    if (open) {
      loadGenres();
      // Si on édite une histoire, pré-remplir le formulaire
      if (storyToEdit) {
        setFormData({
          title_gasy: storyToEdit.title?.gasy || '',
          title_fr: storyToEdit.title?.fr || '',
          title_en: storyToEdit.title?.en || '',
          synopsis_gasy: storyToEdit.synopsis?.gasy || '',
          synopsis_fr: storyToEdit.synopsis?.fr || '',
          synopsis_en: storyToEdit.synopsis?.en || '',
          genre_id: storyToEdit.genre_id?.toString() || '',
          is_premium: storyToEdit.is_premium || false,
        });
        if (storyToEdit.cover_image) {
          setCoverImagePreview(storyToEdit.cover_image);
        }
      } else {
        // Réinitialiser le formulaire pour une nouvelle histoire
        setFormData({
          title_gasy: '',
          title_fr: '',
          title_en: '',
          synopsis_gasy: '',
          synopsis_fr: '',
          synopsis_en: '',
          genre_id: '',
          is_premium: false,
        });
        setCoverImageFile(null);
        setCoverImagePreview('');
      }
    }
  }, [open, storyToEdit]);

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

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier que c'est une image
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Erreur',
          description: 'Veuillez sélectionner un fichier image',
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

      setCoverImageFile(file);
      
      // Créer un aperçu
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCoverImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation : au moins un titre doit être rempli
    if (!formData.title_gasy && !formData.title_fr && !formData.title_en) {
      toast({
        title: 'Erreur',
        description: 'Au moins un titre (Gasy, Français ou Anglais) est requis',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.genre_id) {
      toast({
        title: 'Erreur',
        description: 'Le genre est requis',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);

      // Construire l'objet title avec les langues disponibles
      const title: any = {};
      if (formData.title_gasy) title.gasy = formData.title_gasy;
      if (formData.title_fr) title.fr = formData.title_fr;
      if (formData.title_en) title.en = formData.title_en;

      // Construire l'objet synopsis avec les langues disponibles
      const synopsis: any = {};
      if (formData.synopsis_gasy) synopsis.gasy = formData.synopsis_gasy;
      if (formData.synopsis_fr) synopsis.fr = formData.synopsis_fr;
      if (formData.synopsis_en) synopsis.en = formData.synopsis_en;

      if (storyToEdit) {
        // Mode édition
        await storyApi.updateStory(storyToEdit.id, {
          title,
          synopsis: Object.keys(synopsis).length > 0 ? synopsis : null,
          genre_id: parseInt(formData.genre_id),
          is_premium: formData.is_premium,
          cover_image: coverImagePreview || null
        });

        toast({
          title: 'Succès',
          description: 'L\'histoire a été modifiée avec succès',
        });
      } else {
        // Mode création
        await storyApi.createStory({
          title,
          synopsis: Object.keys(synopsis).length > 0 ? synopsis : null,
          genre_id: parseInt(formData.genre_id),
          is_premium: formData.is_premium,
          cover_image: coverImagePreview || null
        });

        toast({
          title: 'Succès',
          description: 'L\'histoire a été créée avec succès',
        });
      }

      // Réinitialiser le formulaire
      setFormData({
        title_gasy: '',
        title_fr: '',
        title_en: '',
        synopsis_gasy: '',
        synopsis_fr: '',
        synopsis_en: '',
        genre_id: '',
        is_premium: false,
      });
      setCoverImageFile(null);
      setCoverImagePreview('');

      onSuccess();
      onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-secondary border-none text-foreground">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1DB954]/20 rounded-lg">
              <BookOpen className="h-6 w-6 text-[#1DB954]" />
            </div>
            <div>
              <DialogTitle className="text-2xl text-foreground">
                {storyToEdit ? 'Modifier l\'histoire' : 'Créer une nouvelle histoire'}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Remplissez les informations dans les langues de votre choix
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Titre multilingue */}
          <div className="space-y-2">
            <Label className="text-foreground">
              Titre <span className="text-red-500">*</span>
              <span className="text-xs text-muted-foreground ml-2">(Au moins une langue)</span>
            </Label>
            <Tabs defaultValue="gasy" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-card border-none">
                <TabsTrigger value="gasy" className="data-[state=active]:bg-[#1DB954] data-[state=active]:text-black">🇲🇬 Gasy</TabsTrigger>
                <TabsTrigger value="fr" className="data-[state=active]:bg-[#1DB954] data-[state=active]:text-black">🇫🇷 Français</TabsTrigger>
                <TabsTrigger value="en" className="data-[state=active]:bg-[#1DB954] data-[state=active]:text-black">🇬🇧 English</TabsTrigger>
              </TabsList>
              <TabsContent value="gasy" className="mt-3">
                <Input
                  value={formData.title_gasy}
                  onChange={(e) => handleChange('title_gasy', e.target.value)}
                  placeholder="Ny lohateny amin'ny teny gasy"
                  className="bg-secondary border-none text-foreground placeholder:text-muted-foreground/60"
                />
              </TabsContent>
              <TabsContent value="fr" className="mt-3">
                <Input
                  value={formData.title_fr}
                  onChange={(e) => handleChange('title_fr', e.target.value)}
                  placeholder="Le titre en français"
                  className="bg-secondary border-none text-foreground placeholder:text-muted-foreground/60"
                />
              </TabsContent>
              <TabsContent value="en" className="mt-3">
                <Input
                  value={formData.title_en}
                  onChange={(e) => handleChange('title_en', e.target.value)}
                  placeholder="The title in English"
                  className="bg-secondary border-none text-foreground placeholder:text-muted-foreground/60"
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Synopsis multilingue */}
          <div className="space-y-2">
            <Label className="text-foreground">Synopsis <span className="text-xs text-muted-foreground">(Optionnel)</span></Label>
            <Tabs defaultValue="gasy" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-card border-none">
                <TabsTrigger value="gasy" className="data-[state=active]:bg-[#1DB954] data-[state=active]:text-black">🇲🇬 Gasy</TabsTrigger>
                <TabsTrigger value="fr" className="data-[state=active]:bg-[#1DB954] data-[state=active]:text-black">🇫🇷 Français</TabsTrigger>
                <TabsTrigger value="en" className="data-[state=active]:bg-[#1DB954] data-[state=active]:text-black">🇬🇧 English</TabsTrigger>
              </TabsList>
              <TabsContent value="gasy" className="mt-3">
                <Textarea
                  value={formData.synopsis_gasy}
                  onChange={(e) => handleChange('synopsis_gasy', e.target.value)}
                  placeholder="Famintinana fohy momba ny tantara..."
                  rows={4}
                  className="resize-none bg-secondary border-none text-foreground placeholder:text-muted-foreground/60"
                />
              </TabsContent>
              <TabsContent value="fr" className="mt-3">
                <Textarea
                  value={formData.synopsis_fr}
                  onChange={(e) => handleChange('synopsis_fr', e.target.value)}
                  placeholder="Décrivez brièvement votre histoire..."
                  rows={4}
                  className="resize-none bg-secondary border-none text-foreground placeholder:text-muted-foreground/60"
                />
              </TabsContent>
              <TabsContent value="en" className="mt-3">
                <Textarea
                  value={formData.synopsis_en}
                  onChange={(e) => handleChange('synopsis_en', e.target.value)}
                  placeholder="Briefly describe your story..."
                  rows={4}
                  className="resize-none bg-secondary border-none text-foreground placeholder:text-muted-foreground/60"
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <Label htmlFor="genre" className="text-foreground">
              Genre <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.genre_id}
              onValueChange={(value) => handleChange('genre_id', value)}
              required
            >
              <SelectTrigger className="bg-secondary border-none text-foreground">
                <SelectValue placeholder="Sélectionnez un genre" />
              </SelectTrigger>
              <SelectContent className="bg-secondary border-none text-foreground">
                {genres.map((genre) => (
                  <SelectItem key={genre.id} value={genre.id.toString()} className="focus:bg-secondary focus:text-foreground">
                    {genre.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Image de couverture */}
          <div className="space-y-2">
            <Label htmlFor="cover_image" className="text-foreground">Image de couverture</Label>
            {coverImagePreview ? (
              <div className="space-y-3">
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                  <img 
                    src={coverImagePreview} 
                    alt="Aperçu" 
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={removeCoverImage}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-center w-full">
                  <label 
                    htmlFor="cover_image"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <BookOpen className="w-8 h-8 mb-2 text-muted-foreground/60" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Cliquez pour sélectionner</span> ou glissez une image
                      </p>
                      <p className="text-xs text-muted-foreground/60">PNG, JPG, WEBP (MAX. 2MB)</p>
                    </div>
                    <input 
                      id="cover_image" 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground/60">
              Vous pourrez ajouter une image plus tard si vous n'en avez pas maintenant.
            </p>
          </div>

          {/* Histoire premium */}
          <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card">
            <div className="space-y-0.5">
              <Label htmlFor="is_premium" className="text-base text-foreground">
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="bg-transparent border-border text-foreground hover:bg-secondary/50"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold"
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
