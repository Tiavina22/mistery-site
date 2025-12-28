import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { chapterApi } from '@/lib/api';

interface ChapterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapter?: any | null;
  storyId: number;
  onSuccess: () => void;
}

export default function ChapterDialog({ 
  open, 
  onOpenChange, 
  chapter = null, 
  storyId,
  onSuccess 
}: ChapterDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Données du formulaire
  const [chapterNumber, setChapterNumber] = useState('');
  const [titleGasy, setTitleGasy] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [contentGasy, setContentGasy] = useState('');
  const [contentFr, setContentFr] = useState('');
  const [contentEn, setContentEn] = useState('');

  // Charger les données du chapitre en mode édition
  useEffect(() => {
    if (chapter) {
      setChapterNumber(chapter.chapter_number?.toString() || '');
      setTitleGasy(chapter.title?.gasy || '');
      setTitleFr(chapter.title?.fr || '');
      setTitleEn(chapter.title?.en || '');
      setContentGasy(chapter.content?.gasy || '');
      setContentFr(chapter.content?.fr || '');
      setContentEn(chapter.content?.en || '');
    } else {
      resetForm();
    }
  }, [chapter, open]);

  const resetForm = () => {
    setChapterNumber('');
    setTitleGasy('');
    setTitleFr('');
    setTitleEn('');
    setContentGasy('');
    setContentFr('');
    setContentEn('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: au moins un titre et un contenu requis
    if (!titleGasy && !titleFr && !titleEn) {
      toast({
        title: 'Erreur',
        description: 'Au moins un titre est requis (Gasy, Français ou Anglais)',
        variant: 'destructive',
      });
      return;
    }

    if (!contentGasy && !contentFr && !contentEn) {
      toast({
        title: 'Erreur',
        description: 'Au moins un contenu est requis (Gasy, Français ou Anglais)',
        variant: 'destructive',
      });
      return;
    }

    if (!chapterNumber || isNaN(Number(chapterNumber))) {
      toast({
        title: 'Erreur',
        description: 'Le numéro de chapitre est requis et doit être un nombre',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const chapterData = {
        story_id: storyId,
        chapter_number: Number(chapterNumber),
        title: {
          ...(titleGasy && { gasy: titleGasy }),
          ...(titleFr && { fr: titleFr }),
          ...(titleEn && { en: titleEn }),
        },
        content: {
          ...(contentGasy && { gasy: contentGasy }),
          ...(contentFr && { fr: contentFr }),
          ...(contentEn && { en: contentEn }),
        },
      };

      if (chapter) {
        // Mode édition
        await chapterApi.updateChapter(chapter.id, chapterData);
        toast({
          title: 'Succès',
          description: 'Chapitre mis à jour avec succès',
        });
      } else {
        // Mode création
        await chapterApi.createChapter(chapterData);
        toast({
          title: 'Succès',
          description: 'Chapitre créé avec succès',
        });
      }

      resetForm();
      onSuccess();
    } catch (error: any) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: error.response?.data?.message || 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {chapter ? 'Modifier le chapitre' : 'Nouveau chapitre'}
          </DialogTitle>
          <DialogDescription>
            Gasy est la langue officielle, mais vous pouvez aussi ajouter du contenu en français et anglais (optionnel).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Numéro du chapitre */}
            <div>
              <Label htmlFor="chapter_number">
                Numéro du chapitre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="chapter_number"
                type="number"
                min="1"
                value={chapterNumber}
                onChange={(e) => setChapterNumber(e.target.value)}
                placeholder="Ex: 1"
                required
              />
            </div>

            {/* Tabs pour les langues */}
            <Tabs defaultValue="gasy" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="gasy">
                  🇲🇬 Gasy {titleGasy && '✓'}
                </TabsTrigger>
                <TabsTrigger value="fr">
                  🇫🇷 Français {titleFr && '✓'}
                </TabsTrigger>
                <TabsTrigger value="en">
                  🇬🇧 English {titleEn && '✓'}
                </TabsTrigger>
              </TabsList>

              {/* Contenu Gasy */}
              <TabsContent value="gasy" className="space-y-4">
                <div>
                  <Label htmlFor="title_gasy">Titre (Gasy)</Label>
                  <Input
                    id="title_gasy"
                    value={titleGasy}
                    onChange={(e) => setTitleGasy(e.target.value)}
                    placeholder="Ex: Toko 1: Fanombohana"
                  />
                </div>
                <div>
                  <Label htmlFor="content_gasy">Contenu (Gasy)</Label>
                  <Textarea
                    id="content_gasy"
                    value={contentGasy}
                    onChange={(e) => setContentGasy(e.target.value)}
                    placeholder="Soraty eto ny votoatin'ny toko..."
                    rows={10}
                    className="resize-none"
                  />
                </div>
              </TabsContent>

              {/* Contenu Français */}
              <TabsContent value="fr" className="space-y-4">
                <div>
                  <Label htmlFor="title_fr">Titre (Français)</Label>
                  <Input
                    id="title_fr"
                    value={titleFr}
                    onChange={(e) => setTitleFr(e.target.value)}
                    placeholder="Ex: Chapitre 1: Le début"
                  />
                </div>
                <div>
                  <Label htmlFor="content_fr">Contenu (Français)</Label>
                  <Textarea
                    id="content_fr"
                    value={contentFr}
                    onChange={(e) => setContentFr(e.target.value)}
                    placeholder="Écrivez le contenu du chapitre ici..."
                    rows={10}
                    className="resize-none"
                  />
                </div>
              </TabsContent>

              {/* Contenu English */}
              <TabsContent value="en" className="space-y-4">
                <div>
                  <Label htmlFor="title_en">Title (English)</Label>
                  <Input
                    id="title_en"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Ex: Chapter 1: The beginning"
                  />
                </div>
                <div>
                  <Label htmlFor="content_en">Content (English)</Label>
                  <Textarea
                    id="content_en"
                    value={contentEn}
                    onChange={(e) => setContentEn(e.target.value)}
                    placeholder="Write the chapter content here..."
                    rows={10}
                    className="resize-none"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : chapter ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
