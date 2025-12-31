import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import CreatorLayout from '@/components/CreatorLayout';
import { Mail, User, Phone, BookOpen, FileText, CheckCircle, Clock, XCircle, CreditCard, Wallet, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CreatorProfile() {
  const navigate = useNavigate();
  const { author } = useAuth();
  const { t } = useLanguage();
  const [kycInfo, setKycInfo] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loadingKyc, setLoadingKyc] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);

  useEffect(() => {
    if (author) {
      loadKycInfo();
      loadPaymentMethods();
    }
  }, [author]);

  const loadKycInfo = async () => {
    try {
      const token = localStorage.getItem('author_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/authors/${author?.id}/kyc`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setKycInfo(data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du KYC:', error);
    } finally {
      setLoadingKyc(false);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const token = localStorage.getItem('author_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment-methods/author/${author?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setPaymentMethods(data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des méthodes de paiement:', error);
    } finally {
      setLoadingPayments(false);
    }
  };

  if (!author) {
    navigate('/creator/login');
    return null;
  }

  const getStatusBadge = () => {
    switch (author.status) {
      case 'active':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Actif</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500"><Clock className="w-3 h-3 mr-1" /> Inactif</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" /> Suspendu</Badge>;
      default:
        return null;
    }
  };

  const getKycStatusBadge = (status: string) => {
    switch (status) {
      case 'valide':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Vérifié</Badge>;
      case 'en_verification':
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" /> En vérification</Badge>;
      case 'rejete':
        return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" /> Rejeté</Badge>;
      default:
        return <Badge className="bg-gray-500"><Clock className="w-3 h-3 mr-1" /> En attente</Badge>;
    }
  };

  return (
    <CreatorLayout>
      <div className="p-8 max-w-5xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Mon Profil</h1>
        
        <div className="space-y-6">
          {/* Avatar et informations principales */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Informations du compte</CardTitle>
              <CardDescription className="text-muted-foreground">
                Vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <Avatar className="w-24 h-24">
                  {author.avatar ? (
                    <AvatarImage src={author.avatar} alt={author.pseudo} />
                  ) : (
                    <AvatarFallback className="bg-[#1DB954] text-black text-2xl font-bold">
                      {author.pseudo?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-foreground">{author.pseudo}</h2>
                    {getStatusBadge()}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{author.email}</span>
                    </div>
                    
                    {author.phone_number && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{author.phone_number}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Spécialité et biographie */}
          {(author.speciality || author.biography) && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">À propos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {author.speciality && (
                  <div>
                    <Label className="text-muted-foreground flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4" />
                      Spécialité
                    </Label>
                    <p className="text-lg font-medium text-foreground">{author.speciality}</p>
                  </div>
                )}
                
                {author.biography && (
                  <div>
                    <Label className="text-muted-foreground flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4" />
                      Biographie
                    </Label>
                    <p className="text-foreground whitespace-pre-wrap">{author.biography}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Informations du compte */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Informations du compte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID du compte</span>
                  <span className="text-foreground font-mono">{author.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Statut</span>
                  <span className="text-foreground capitalize">{author.status}</span>
                </div>
                {author.created_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Membre depuis</span>
                    <span className="text-foreground">
                      {new Date(author.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* KYC Information */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Vérification d'identité (KYC)
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                État de vérification de votre identité
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingKyc ? (
                <p className="text-muted-foreground">Chargement...</p>
              ) : kycInfo ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Statut de vérification</span>
                    {getKycStatusBadge(kycInfo.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Numéro CIN</span>
                    <span className="text-foreground font-mono">{kycInfo.cin_number}</span>
                  </div>
                  {kycInfo.rejection_reason && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                      <p className="text-red-400 text-sm">
                        <strong>Raison du rejet :</strong> {kycInfo.rejection_reason}
                      </p>
                    </div>
                  )}
                  {kycInfo.status === 'en_verification' && (
                    <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3">
                      <p className="text-yellow-400 text-sm">
                        ⏳ Vos documents sont en cours de vérification. Vous serez notifié sous 24-48h.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucune information KYC disponible</p>
              )}
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Méthodes de paiement
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Vos moyens de paiement pour recevoir vos revenus
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingPayments ? (
                <p className="text-muted-foreground">Chargement...</p>
              ) : paymentMethods.length > 0 ? (
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="bg-secondary rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {method.provider?.logo && (
                            <img 
                              src={method.provider.logo} 
                              alt={method.provider.name}
                              className="w-10 h-10 object-contain"
                            />
                          )}
                          <div>
                            <h4 className="font-semibold text-foreground">{method.provider?.name}</h4>
                            {method.is_primary && (
                              <Badge className="bg-[#1DB954] text-black mt-1">
                                <CreditCard className="w-3 h-3 mr-1" />
                                Principal
                              </Badge>
                            )}
                          </div>
                        </div>
                        {method.is_verified ? (
                          <Badge className="bg-green-500">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Vérifié
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-500">
                            <Clock className="w-3 h-3 mr-1" />
                            En attente
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Numéro</span>
                          <span className="text-foreground font-mono">{method.phone_number}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Titulaire</span>
                          <span className="text-foreground">{method.account_holder_name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
                  <p className="text-yellow-400 text-sm">
                    ⚠️ Aucun moyen de paiement configuré. Ajoutez-en un pour recevoir vos paiements.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </CreatorLayout>
  );
}
