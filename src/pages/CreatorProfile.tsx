import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CreatorLayout from '@/components/CreatorLayout';
import { Mail, User, Phone, BookOpen, FileText, CheckCircle, Clock, XCircle, CreditCard, Wallet, Shield, Upload, X, Camera } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function CreatorProfile() {
  const navigate = useNavigate();
  const { author } = useAuth();
  const { t } = useLanguage();
  const [kycInfo, setKycInfo] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loadingKyc, setLoadingKyc] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [submittingKyc, setSubmittingKyc] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState<number | null>(null);
  const [showKycForm, setShowKycForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState<number | null>(null);
  const [kycFormData, setKycFormData] = useState({ 
    cin_number: '', 
    cin_front: null as File | null,
    cin_back: null as File | null,
    selfie_with_cin: null as File | null
  });
  const [paymentFormData, setPaymentFormData] = useState({ phone_number: '', account_holder_name: '' });
  const [kycPreview, setKycPreview] = useState<{ cin_front: string | null; cin_back: string | null; selfie: string | null }>({
    cin_front: null,
    cin_back: null,
    selfie: null
  });
  
  // États et refs pour la caméra selfie
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (author) {
      loadKycInfo();
      loadPaymentMethods();
    }
    
    // Cleanup camera on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [author]);

  const loadKycInfo = async () => {
    try {
      const token = localStorage.getItem('author_token');
      const response = await fetch(`${API_BASE_URL}/api/authors/${author?.id}/kyc`, {
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
      const response = await fetch(`${API_BASE_URL}/api/payment-methods/author/${author?.id}`, {
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

  const handleKycFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kycFormData.cin_number || !kycFormData.cin_number.trim()) {
      alert('❌ Le numéro CIN est requis');
      return;
    }
    if (!kycFormData.cin_front) {
      alert('❌ La photo du recto du CIN est requise');
      return;
    }
    if (!kycFormData.cin_back) {
      alert('❌ La photo du verso du CIN est requise');
      return;
    }
    if (!kycFormData.selfie_with_cin) {
      alert('❌ La selfie avec le CIN est requise');
      return;
    }

    setSubmittingKyc(true);
    try {
      const token = localStorage.getItem('author_token');
      
      const response = await fetch(`${API_BASE_URL}/api/authors/kyc/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cin_number: kycFormData.cin_number,
          cin_front: kycPreview.cin_front,
          cin_back: kycPreview.cin_back,
          selfie_with_cin: kycPreview.selfie
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ KYC soumis avec succès! Nos équipes l\'examineront bientôt.');
        setShowKycForm(false);
        setKycFormData({ cin_number: '', cin_front: null, cin_back: null, selfie_with_cin: null });
        loadKycInfo();
      } else {
        alert('❌ Erreur: ' + (data.message || 'Impossible de soumettre le KYC'));
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Une erreur est survenue');
    } finally {
      setSubmittingKyc(false);
    }
  };

  const handleCinImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'cin_front' | 'cin_back' | 'selfie') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('❌ L\'image ne doit pas dépasser 5MB');
      e.target.value = ''; // Reset input
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      
      if (type === 'cin_front') {
        setKycFormData(prev => ({ ...prev, cin_front: file }));
        setKycPreview(prev => ({ ...prev, cin_front: base64String }));
      } else if (type === 'cin_back') {
        setKycFormData(prev => ({ ...prev, cin_back: file }));
        setKycPreview(prev => ({ ...prev, cin_back: base64String }));
      } else if (type === 'selfie') {
        setKycFormData(prev => ({ ...prev, selfie_with_cin: file }));
        setKycPreview(prev => ({ ...prev, selfie: base64String }));
      }
    };
    reader.onloadend = () => {
      e.target.value = ''; // Reset input after reading
    };
    reader.readAsDataURL(file);
  };

  const removeKycImage = (type: 'cin_front' | 'cin_back' | 'selfie') => {
    if (type === 'cin_front') {
      setKycFormData({ ...kycFormData, cin_front: null });
      setKycPreview({ ...kycPreview, cin_front: null });
    } else if (type === 'cin_back') {
      setKycFormData({ ...kycFormData, cin_back: null });
      setKycPreview({ ...kycPreview, cin_back: null });
    } else if (type === 'selfie') {
      setKycFormData({ ...kycFormData, selfie_with_cin: null });
      setKycPreview({ ...kycPreview, selfie: null });
    }
  };

  // Caméra pour selfie uniquement
  const startCamera = async () => {
    try {
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      alert('❌ Impossible d\'accéder à la caméra. Veuillez autoriser l\'accès.');
      console.error('Erreur caméra:', err);
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const takeSelfie = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const base64String = canvas.toDataURL('image/jpeg', 0.8);
        setKycPreview(prev => ({ ...prev, selfie: base64String }));
        
        // Convertir base64 en File pour le submit
        fetch(base64String)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
            setKycFormData(prev => ({ ...prev, selfie_with_cin: file }));
          });
        
        stopCamera();
      }
    }
  };

  const openCinCamera = async (type: 'cin_front' | 'cin_back') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      setTimeout(() => {
        const context = canvas.getContext('2d');
        if (context) {
          context.drawImage(video, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], `kyc-${type}.jpg`, { type: 'image/jpeg' });
              const reader = new FileReader();
              reader.onload = (event) => {
                const base64String = event.target?.result as string;
                if (type === 'cin_front') {
                  setKycFormData(prev => ({ ...prev, cin_front: file }));
                  setKycPreview(prev => ({ ...prev, cin_front: base64String }));
                } else if (type === 'cin_back') {
                  setKycFormData(prev => ({ ...prev, cin_back: file }));
                  setKycPreview(prev => ({ ...prev, cin_back: base64String }));
                }
              };
              reader.readAsDataURL(file);
            }
            stream.getTracks().forEach(track => track.stop());
          });
        }
      }, 1000);
    } catch (error) {
      alert('❌ Impossible d\'accéder à la caméra');
      console.error(error);
    }
  };

  const handlePaymentFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentFormData.phone_number || !paymentFormData.account_holder_name) {
      alert('❌ Tous les champs sont requis');
      return;
    }

    setSubmittingPayment(showPaymentForm);
    try {
      const token = localStorage.getItem('author_token');
      const response = await fetch(`${API_BASE_URL}/api/authors/payment-method/resubmit/${showPaymentForm}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone_number: paymentFormData.phone_number,
          account_holder_name: paymentFormData.account_holder_name
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Moyen de paiement resoumis avec succès!');
        setShowPaymentForm(null);
        setPaymentFormData({ phone_number: '', account_holder_name: '' });
        loadPaymentMethods();
      } else {
        alert('❌ Erreur: ' + (data.message || 'Impossible de resoumettere le moyen de paiement'));
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Une erreur est survenue');
    } finally {
      setSubmittingPayment(null);
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
                    <div className="space-y-3">
                      <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                        <p className="text-red-400 text-sm">
                          <strong>Raison du rejet :</strong> {kycInfo.rejection_reason}
                        </p>
                      </div>
                      <Button 
                        onClick={() => {
                          setKycFormData({ cin_number: kycInfo.cin_number, cin_front: null, cin_back: null, selfie_with_cin: null });
                          setShowKycForm(true);
                        }}
                        disabled={submittingKyc}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {submittingKyc ? 'En cours...' : 'Réessayer'}
                      </Button>
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
                <div className="space-y-3">
                  <p className="text-muted-foreground">Aucune information KYC disponible</p>
                  <Button 
                    onClick={() => {
                      setKycFormData({ cin_number: '', cin_front: null, cin_back: null, selfie_with_cin: null });
                      setKycPreview({ cin_front: null, cin_back: null, selfie: null });
                      setShowKycForm(true);
                    }}
                    disabled={submittingKyc}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {submittingKyc ? 'En cours...' : 'Soumettre mon KYC'}
                  </Button>
                </div>
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
                        ) : method.rejection_reason ? (
                          <Badge className="bg-red-500">
                            <XCircle className="w-3 h-3 mr-1" />
                            Rejeté
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
                      {method.rejection_reason && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mt-3 space-y-3">
                          <p className="text-red-400 text-sm">
                            <strong>Raison du rejet :</strong> {method.rejection_reason}
                          </p>
                          <Button 
                            onClick={() => {
                              setPaymentFormData({ 
                                phone_number: method.phone_number, 
                                account_holder_name: method.account_holder_name 
                              });
                              setShowPaymentForm(method.id);
                            }}
                            disabled={submittingPayment === method.id}
                            className="bg-blue-600 hover:bg-blue-700 w-full text-sm"
                          >
                            {submittingPayment === method.id ? 'En cours...' : 'Réessayer'}
                          </Button>
                        </div>
                      )}
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

        {/* Modal Formulaire KYC */}
        {showKycForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-card border-border w-full max-w-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Resoumettere KYC</CardTitle>
                  <CardDescription className="text-muted-foreground">Veuillez fournir de nouveaux documents</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowKycForm(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleKycFormSubmit} className="space-y-4 max-h-96 overflow-y-auto">
                  <div>
                    <Label className="text-foreground">Numéro CIN</Label>
                    <Input 
                      type="text"
                      value={kycFormData.cin_number}
                      onChange={(e) => setKycFormData({ ...kycFormData, cin_number: e.target.value })}
                      placeholder="Ex: 123456789012"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-foreground">Recto du CIN *</Label>
                    {kycPreview.cin_front && (
                      <div className="relative mb-3">
                        <img src={kycPreview.cin_front} alt="CIN Recto" className="w-full h-40 object-cover rounded-lg" />
                        <button
                          onClick={() => removeKycImage('cin_front')}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {!kycPreview.cin_front && (
                      <div className="flex gap-2">
                        <div className="flex-1 border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-primary transition">
                          <input 
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleCinImageUpload(e, 'cin_front')}
                            className="hidden"
                            id="cin-front"
                          />
                          <label htmlFor="cin-front" className="flex flex-col items-center gap-2 cursor-pointer">
                            <Upload className="w-5 h-5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Upload</span>
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => openCinCamera('cin_front')}
                          className="flex-1 border-2 border-dashed border-border rounded-lg p-4 hover:border-primary transition text-center"
                        >
                          📷 Photo
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-foreground">Verso du CIN *</Label>
                    {kycPreview.cin_back && (
                      <div className="relative mb-3">
                        <img src={kycPreview.cin_back} alt="CIN Verso" className="w-full h-40 object-cover rounded-lg" />
                        <button
                          onClick={() => removeKycImage('cin_back')}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {!kycPreview.cin_back && (
                      <div className="flex gap-2">
                        <div className="flex-1 border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-primary transition">
                          <input 
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleCinImageUpload(e, 'cin_back')}
                            className="hidden"
                            id="cin-back"
                          />
                          <label htmlFor="cin-back" className="flex flex-col items-center gap-2 cursor-pointer">
                            <Upload className="w-5 h-5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Upload</span>
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => openCinCamera('cin_back')}
                          className="flex-1 border-2 border-dashed border-border rounded-lg p-4 hover:border-primary transition text-center"
                        >
                          📷 Photo
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-foreground font-semibold">
                      Selfie avec CIN à la main <span className="text-red-500">*</span>
                    </Label>
                    <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-3 mb-3">
                      <p className="text-blue-400 text-sm">
                        📸 Prenez un selfie en tenant votre CIN dans votre main droite, visage et CIN bien visibles
                      </p>
                    </div>

                    {showCamera ? (
                      <div className="space-y-3">
                        <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            onClick={takeSelfie}
                            className="flex-1 bg-[#1DB954] hover:bg-[#1ed760] text-white font-semibold h-12"
                          >
                            <Camera className="w-5 h-5 mr-2" />
                            Prendre la photo
                          </Button>
                          <Button
                            type="button"
                            onClick={stopCamera}
                            variant="outline"
                            className="px-6 border-border text-muted-foreground hover:text-foreground hover:border-border h-12"
                          >
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : kycPreview.selfie ? (
                      <div className="relative bg-black rounded-lg overflow-hidden">
                        <img 
                          src={kycPreview.selfie} 
                          alt="Selfie avec CIN" 
                          className="w-full h-64 object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => removeKycImage('selfie')}
                          className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors z-10"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={startCamera}
                          className="absolute bottom-2 right-2 px-4 py-2 bg-[#1DB954] hover:bg-[#1ed760] rounded-lg text-black text-sm font-semibold transition-colors z-10"
                        >
                          Reprendre
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={startCamera}
                        className="w-full h-64 border-2 border-dashed border-border rounded-lg hover:border-[#1DB954] transition-colors bg-secondary cursor-pointer flex flex-col items-center justify-center gap-3"
                      >
                        <Camera className="w-10 h-10 text-muted-foreground" />
                        <span className="text-base font-semibold text-foreground">Ouvrir la caméra</span>
                      </div>
                    )}
                  </div>

                  <Button type="submit" disabled={submittingKyc} className="w-full bg-blue-600 hover:bg-blue-700">
                    {submittingKyc ? 'Envoi...' : 'Resoumettere'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal Formulaire Paiement */}
        {showPaymentForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-card border-border w-full max-w-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Resoumettere Moyen de Paiement</CardTitle>
                  <CardDescription className="text-muted-foreground">Veuillez mettre à jour vos informations</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowPaymentForm(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePaymentFormSubmit} className="space-y-4">
                  <div>
                    <Label className="text-foreground">Numéro de téléphone</Label>
                    <Input 
                      type="tel"
                      value={paymentFormData.phone_number}
                      onChange={(e) => setPaymentFormData({ ...paymentFormData, phone_number: e.target.value })}
                      placeholder="Entrez le numéro de téléphone"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-foreground">Titulaire du compte</Label>
                    <Input 
                      type="text"
                      value={paymentFormData.account_holder_name}
                      onChange={(e) => setPaymentFormData({ ...paymentFormData, account_holder_name: e.target.value })}
                      placeholder="Entrez le nom du titulaire"
                      className="mt-2"
                    />
                  </div>

                  <Button type="submit" disabled={submittingPayment === showPaymentForm} className="w-full bg-blue-600 hover:bg-blue-700">
                    {submittingPayment === showPaymentForm ? 'Envoi...' : 'Resoumettere'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </CreatorLayout>
  );
}
