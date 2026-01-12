import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Crown,
  Globe,
  MapPin,
  Check,
  X,
  Clock,
  DollarSign,
  Gift,
  List
} from 'lucide-react';

interface SubscriptionOffer {
  id: number;
  name: { fr: string; en: string } | string;
  duration: number;
  state: 'active' | 'inactive';
  is_international: boolean;
  amount: number;
  currency: string;
  advantages: Array<{ lang: string; advantages: string[] }>;
  created_at: string;
  updated_at: string;
}

interface OfferFormData {
  name_fr: string;
  name_en: string;
  duration: number;
  state: 'active' | 'inactive';
  is_international: boolean;
  amount: number;
  currency: string;
  advantages_fr: string;
  advantages_en: string;
}

const initialFormData: OfferFormData = {
  name_fr: '',
  name_en: '',
  duration: 1,
  state: 'active',
  is_international: false,
  amount: 0,
  currency: 'MGA',
  advantages_fr: '',
  advantages_en: '',
};

export default function AdminSubscriptionOffers() {
  const { token } = useAdmin();
  const { toast } = useToast();
  const [offers, setOffers] = useState<SubscriptionOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<SubscriptionOffer | null>(null);
  const [deletingOffer, setDeletingOffer] = useState<SubscriptionOffer | null>(null);
  const [formData, setFormData] = useState<OfferFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [locationFilter, setLocationFilter] = useState<string>('all');

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/subscription-offers`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      if (data.success) {
        setOffers(data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les offres',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingOffer(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  const openEditDialog = (offer: SubscriptionOffer) => {
    setEditingOffer(offer);
    
    // Parse name
    let name_fr = '';
    let name_en = '';
    if (typeof offer.name === 'object') {
      name_fr = offer.name.fr || '';
      name_en = offer.name.en || '';
    } else {
      name_fr = offer.name;
      name_en = offer.name;
    }

    // Parse advantages
    let advantages_fr = '';
    let advantages_en = '';
    if (Array.isArray(offer.advantages)) {
      const frAdvantages = offer.advantages.find(a => a.lang === 'fr');
      const enAdvantages = offer.advantages.find(a => a.lang === 'en');
      if (frAdvantages) advantages_fr = frAdvantages.advantages.join('\n');
      if (enAdvantages) advantages_en = enAdvantages.advantages.join('\n');
    }

    setFormData({
      name_fr,
      name_en,
      duration: offer.duration,
      state: offer.state,
      is_international: offer.is_international,
      amount: offer.amount,
      currency: offer.currency,
      advantages_fr,
      advantages_en,
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (offer: SubscriptionOffer) => {
    setDeletingOffer(offer);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name_fr || !formData.amount) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);

      // Build name object
      const name = {
        fr: formData.name_fr,
        en: formData.name_en || formData.name_fr,
      };

      // Build advantages array
      const advantages = [];
      if (formData.advantages_fr.trim()) {
        advantages.push({
          lang: 'fr',
          advantages: formData.advantages_fr.split('\n').filter(a => a.trim()),
        });
      }
      if (formData.advantages_en.trim()) {
        advantages.push({
          lang: 'en',
          advantages: formData.advantages_en.split('\n').filter(a => a.trim()),
        });
      }

      const url = editingOffer
        ? `${import.meta.env.VITE_API_URL}/api/subscription-offers/${editingOffer.id}`
        : `${import.meta.env.VITE_API_URL}/api/subscription-offers`;

      const method = editingOffer ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          duration: formData.duration,
          state: formData.state,
          is_international: formData.is_international,
          amount: formData.amount,
          currency: formData.currency,
          advantages,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Succès',
          description: editingOffer ? 'Offre mise à jour' : 'Offre créée',
        });
        setIsDialogOpen(false);
        loadOffers();
      } else {
        toast({
          title: 'Erreur',
          description: data.error || 'Une erreur est survenue',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingOffer) return;

    try {
      setSubmitting(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/subscription-offers/${deletingOffer.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Succès',
          description: 'Offre supprimée',
        });
        setIsDeleteDialogOpen(false);
        setDeletingOffer(null);
        loadOffers();
      } else {
        toast({
          title: 'Erreur',
          description: data.error || 'Une erreur est survenue',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleOfferState = async (offer: SubscriptionOffer) => {
    try {
      const newState = offer.state === 'active' ? 'inactive' : 'active';
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/subscription-offers/${offer.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ state: newState }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Succès',
          description: `Offre ${newState === 'active' ? 'activée' : 'désactivée'}`,
        });
        loadOffers();
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive',
      });
    }
  };

  const getOfferName = (offer: SubscriptionOffer): string => {
    if (typeof offer.name === 'object') {
      return offer.name.fr || offer.name.en || 'Sans nom';
    }
    return offer.name || 'Sans nom';
  };

  const formatAmount = (amount: number, currency: string): string => {
    if (currency === 'MGA') {
      return `${amount.toLocaleString('fr-FR')} Ar`;
    }
    return `${amount.toLocaleString('fr-FR')} ${currency}`;
  };

  const getAdvantagesCount = (offer: SubscriptionOffer): number => {
    if (!Array.isArray(offer.advantages)) return 0;
    const frAdvantages = offer.advantages.find(a => a.lang === 'fr');
    return frAdvantages?.advantages?.length || 0;
  };

  const filteredOffers = offers.filter(offer => {
    if (locationFilter === 'all') return true;
    if (locationFilter === 'madagascar') return !offer.is_international;
    if (locationFilter === 'international') return offer.is_international;
    return true;
  });

  const madagascarOffers = offers.filter(o => !o.is_international);
  const internationalOffers = offers.filter(o => o.is_international);
  const activeOffers = offers.filter(o => o.state === 'active');

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Offres d'abonnement</h1>
            <p className="text-muted-foreground">Gérez les offres Premium pour les utilisateurs</p>
          </div>
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle offre
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Offres</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{offers.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Offres Actives</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">{activeOffers.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Madagascar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-500">{madagascarOffers.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">International</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-500">{internationalOffers.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <div className="flex gap-4">
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer par zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les zones</SelectItem>
              <SelectItem value="madagascar">Madagascar</SelectItem>
              <SelectItem value="international">International</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Liste des offres */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Liste des offres</CardTitle>
            <CardDescription>Toutes les offres d'abonnement disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Chargement...
              </div>
            ) : filteredOffers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune offre trouvée
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className={`p-4 rounded-lg border ${
                      offer.state === 'active' 
                        ? 'border-green-500/30 bg-green-500/5' 
                        : 'border-border bg-secondary/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <Crown className="w-5 h-5 text-yellow-500" />
                          <h3 className="text-lg font-semibold text-foreground">
                            {getOfferName(offer)}
                          </h3>
                          {offer.is_international ? (
                            <Badge variant="outline" className="gap-1 border-purple-500 text-purple-500">
                              <Globe className="w-3 h-3" />
                              International
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1 border-blue-500 text-blue-500">
                              <MapPin className="w-3 h-3" />
                              Madagascar
                            </Badge>
                          )}
                          {offer.state === 'active' ? (
                            <Badge className="bg-green-500 hover:bg-green-600">
                              <Check className="w-3 h-3 mr-1" />
                              Actif
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <X className="w-3 h-3 mr-1" />
                              Inactif
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-semibold text-foreground">
                              {formatAmount(offer.amount, offer.currency)}
                            </span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {offer.duration} mois
                          </span>
                          <span className="flex items-center gap-1">
                            <Gift className="w-4 h-4" />
                            {getAdvantagesCount(offer)} avantages
                          </span>
                        </div>

                        {Array.isArray(offer.advantages) && offer.advantages.length > 0 && (
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-2">
                              {offer.advantages
                                .find(a => a.lang === 'fr')
                                ?.advantages?.slice(0, 3)
                                .map((adv, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {adv}
                                  </Badge>
                                ))}
                              {getAdvantagesCount(offer) > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{getAdvantagesCount(offer) - 3} autres
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleOfferState(offer)}
                          title={offer.state === 'active' ? 'Désactiver' : 'Activer'}
                        >
                          {offer.state === 'active' ? (
                            <X className="w-4 h-4 text-red-500" />
                          ) : (
                            <Check className="w-4 h-4 text-green-500" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(offer)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(offer)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog Création/Edition */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingOffer ? 'Modifier l\'offre' : 'Nouvelle offre'}
              </DialogTitle>
              <DialogDescription>
                {editingOffer 
                  ? 'Modifiez les informations de l\'offre' 
                  : 'Créez une nouvelle offre d\'abonnement'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Nom FR */}
              <div className="space-y-2">
                <Label htmlFor="name_fr">Nom (Français) *</Label>
                <Input
                  id="name_fr"
                  placeholder="Premium 1 mois"
                  value={formData.name_fr}
                  onChange={(e) => setFormData({ ...formData, name_fr: e.target.value })}
                />
              </div>

              {/* Nom EN */}
              <div className="space-y-2">
                <Label htmlFor="name_en">Nom (Anglais)</Label>
                <Input
                  id="name_en"
                  placeholder="Premium 1 month"
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Durée */}
                <div className="space-y-2">
                  <Label htmlFor="duration">Durée (mois) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 1 })}
                  />
                </div>

                {/* Montant */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Montant *</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Devise */}
                <div className="space-y-2">
                  <Label htmlFor="currency">Devise</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MGA">MGA (Ariary)</SelectItem>
                      <SelectItem value="EUR">EUR (Euro)</SelectItem>
                      <SelectItem value="USD">USD (Dollar)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Statut */}
                <div className="space-y-2">
                  <Label htmlFor="state">Statut</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, state: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* International */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div className="space-y-0.5">
                  <Label>Offre Internationale</Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.is_international 
                      ? 'Cette offre est pour les utilisateurs hors Madagascar' 
                      : 'Cette offre est pour les utilisateurs à Madagascar'}
                  </p>
                </div>
                <Switch
                  checked={formData.is_international}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_international: checked })}
                />
              </div>

              {/* Avantages FR */}
              <div className="space-y-2">
                <Label htmlFor="advantages_fr">
                  <div className="flex items-center gap-2">
                    <List className="w-4 h-4" />
                    Avantages (Français)
                  </div>
                </Label>
                <textarea
                  id="advantages_fr"
                  placeholder="Un avantage par ligne..."
                  value={formData.advantages_fr}
                  onChange={(e) => setFormData({ ...formData, advantages_fr: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground">
                  Entrez un avantage par ligne
                </p>
              </div>

              {/* Avantages EN */}
              <div className="space-y-2">
                <Label htmlFor="advantages_en">
                  <div className="flex items-center gap-2">
                    <List className="w-4 h-4" />
                    Avantages (Anglais)
                  </div>
                </Label>
                <textarea
                  id="advantages_en"
                  placeholder="One advantage per line..."
                  value={formData.advantages_en}
                  onChange={(e) => setFormData({ ...formData, advantages_en: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Enregistrement...' : editingOffer ? 'Mettre à jour' : 'Créer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Suppression */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Supprimer l'offre</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer l'offre "{deletingOffer ? getOfferName(deletingOffer) : ''}" ?
                Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
                {submitting ? 'Suppression...' : 'Supprimer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
