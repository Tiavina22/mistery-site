import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2, Upload, X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { useRef, useEffect } from 'react';

function CreatorRegister() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6; // Augmenté de 5 à 6 pour inclure l'étape KYC
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [countdown, setCountdown] = useState(60);
  
  const [formData, setFormData] = useState({
    email: '',
    pseudo: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
    biography: '',
    speciality: '',
    avatar: '',
    cin_number: '',
    cin_recto: '',
    cin_verso: '',
    cin_selfie: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [cinRectoPreview, setCinRectoPreview] = useState<string | null>(null);
  const [cinVersoPreview, setCinVersoPreview] = useState<string | null>(null);
  const [cinSelfiePreview, setCinSelfiePreview] = useState<string | null>(null);
  const canSubmitRef = useRef(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const sendOTP = async () => {
    try {
      setError('');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/authors/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          pseudo: formData.pseudo
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'envoi du code');
      }

      setIsOtpSent(true);
      setCanResendOtp(false);
      setCountdown(60);

      // Démarrer le compte à rebours
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Avancer à l'étape 2 après l'envoi réussi
      setCurrentStep(2);

    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'envoi du code');
      throw err;
    }
  };

  const verifyOTP = async () => {
    try {
      setError('');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/authors/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          code: otpCode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Code OTP invalide');
      }

      return true;
    } catch (err: any) {
      setError(err.message || 'Code OTP invalide');
      throw err;
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image ne doit pas dépasser 5MB');
        return;
      }

      // Vérifier le type
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner une image valide');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, avatar: base64String }));
        setAvatarPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setFormData(prev => ({ ...prev, avatar: '' }));
    setAvatarPreview(null);
  };

  // Gestion des images CIN
  const handleCinImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'recto' | 'verso' | 'selfie') => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image ne doit pas dépasser 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === 'recto') {
          setFormData(prev => ({ ...prev, cin_recto: base64String }));
          setCinRectoPreview(base64String);
        } else if (type === 'verso') {
          setFormData(prev => ({ ...prev, cin_verso: base64String }));
          setCinVersoPreview(base64String);
        } else {
          setFormData(prev => ({ ...prev, cin_selfie: base64String }));
          setCinSelfiePreview(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCinImage = (type: 'recto' | 'verso' | 'selfie') => {
    if (type === 'recto') {
      setFormData(prev => ({ ...prev, cin_recto: '' }));
      setCinRectoPreview(null);
    } else if (type === 'verso') {
      setFormData(prev => ({ ...prev, cin_verso: '' }));
      setCinVersoPreview(null);
    } else {
      setFormData(prev => ({ ...prev, cin_selfie: '' }));
      setCinSelfiePreview(null);
    }
  };

  // Gestion de la caméra pour le selfie
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setShowCamera(true);
    } catch (err) {
      setError('Impossible d\'accéder à la caméra. Veuillez autoriser l\'accès.');
      console.error('Erreur caméra:', err);
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
        setFormData(prev => ({ ...prev, cin_selfie: base64String }));
        setCinSelfiePreview(base64String);
        stopCamera();
      }
    }
  };

  // Nettoyer la caméra au démontage
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const validateStep = (step: number): boolean => {
    setError('');
    
    switch (step) {
      case 1:
        if (!formData.email) {
          setError('L\'email est requis');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          setError('Email invalide');
          return false;
        }
        if (!formData.pseudo || formData.pseudo.length < 3) {
          setError('Le pseudo doit contenir au moins 3 caractères');
          return false;
        }
        return true;

      case 2:
        if (!otpCode || otpCode.length !== 6) {
          setError('Veuillez entrer le code à 6 chiffres');
          return false;
        }
        return true;

      case 3:
        if (!formData.password || formData.password.length < 8) {
          setError('Le mot de passe doit contenir au moins 8 caractères');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          return false;
        }
        return true;

      case 4:
        if (!formData.avatar) {
          setError('Veuillez ajouter un avatar');
          return false;
        }
        return true;

      case 5:
        // Validation KYC
        if (!formData.cin_number || formData.cin_number.length < 5) {
          setError('Veuillez entrer un numéro de CIN valide');
          return false;
        }
        if (!formData.cin_recto) {
          setError('Veuillez uploader le recto de votre CIN');
          return false;
        }
        if (!formData.cin_verso) {
          setError('Veuillez uploader le verso de votre CIN');
          return false;
        }
        if (!formData.cin_selfie) {
          setError('Veuillez uploader votre selfie avec la CIN');
          return false;
        }
        return true;

      case 6:
        return true;

      default:
        return true;
    }
  };

  const handleNext = async () => {
    console.log('📍 handleNext appelé - Étape actuelle:', currentStep);
    
    if (!validateStep(currentStep)) {
      return;
    }

    // Étape 1 : Envoyer l'OTP
    if (currentStep === 1) {
      setIsLoading(true);
      try {
        await sendOTP();
      } catch (err) {
        console.error('Erreur envoi OTP:', err);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Étape 2 : Vérifier l'OTP
    if (currentStep === 2) {
      setIsLoading(true);
      try {
        const isValid = await verifyOTP();
        if (isValid) {
          console.log('✅ OTP vérifié, passage à l\'étape 3');
          setCurrentStep(3);
        }
      } catch (err) {
        console.error('Erreur vérification OTP:', err);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Étapes 3, 4 : Avancer normalement
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      console.log(`⏭️ Passage de l'étape ${currentStep} à l'étape ${nextStep}`);
      setCurrentStep(nextStep);
      // Activer la soumission seulement si on arrive à la dernière étape
      if (nextStep === totalSteps) {
        console.log('⚠️ Arrivé à la dernière étape, soumission sera possible');
        // NE PAS activer canSubmitRef ici - seulement quand l'utilisateur clique sur "Créer mon compte"
      }
    }
  };

  const handlePrevious = () => {
    setError('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔴 handleSubmit appelé - Étape actuelle:', currentStep, 'Total étapes:', totalSteps, 'canSubmit:', canSubmitRef.current);
    
    // Double vérification : ne soumettre que si on est à la dernière étape ET que canSubmitRef est true
    if (currentStep !== totalSteps || !canSubmitRef.current) {
      console.log('❌ Soumission empêchée - pas à la dernière étape ou canSubmit=false');
      return;
    }
    
    if (!validateStep(5)) {
      console.log('❌ Validation de l\'étape 5 échouée');
      return;
    }

    console.log('✅ Début de l\'inscription...');
    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      console.log('📦 Données d\'inscription:', { ...registerData, password: '***' });
      await register(registerData);
      console.log('✅ Inscription réussie, navigation vers dashboard');
      navigate('/creator/dashboard');
    } catch (err: any) {
      console.error('❌ Erreur lors de l\'inscription:', err);
      setError(err.message || t('creator.register.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-semibold">
                Email *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoFocus
                className="bg-secondary border-none text-foreground placeholder:text-muted-foreground h-12 focus-visible:ring-2 focus-visible:ring-[#1DB954]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pseudo" className="text-foreground font-semibold">
                Pseudo *
              </Label>
              <Input
                id="pseudo"
                name="pseudo"
                type="text"
                placeholder="Votre pseudo unique"
                value={formData.pseudo}
                onChange={handleChange}
                required
                className="bg-secondary border-none text-foreground placeholder:text-muted-foreground h-12 focus-visible:ring-2 focus-visible:ring-[#1DB954]"
              />
              <p className="text-xs text-muted-foreground">Minimum 3 caractères, ce sera votre identifiant unique</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <p className="text-muted-foreground text-sm mb-2">
                Un code de vérification a été envoyé à
              </p>
              <p className="text-foreground font-semibold">{formData.email}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otpCode" className="text-foreground font-semibold">
                Code de vérification *
              </Label>
              <Input
                id="otpCode"
                name="otpCode"
                type="text"
                placeholder="000000"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleNext();
                  }
                }}
                required
                autoFocus
                maxLength={6}
                className="bg-secondary border-none text-foreground placeholder:text-muted-foreground h-12 text-center text-2xl font-bold tracking-widest focus-visible:ring-2 focus-visible:ring-[#1DB954]"
              />
              <p className="text-xs text-muted-foreground text-center">Entrez le code à 6 chiffres</p>
            </div>

            <div className="text-center">
              {canResendOtp ? (
                <Button
                  type="button"
                  onClick={sendOTP}
                  variant="link"
                  className="text-[#1DB954] hover:text-[#1ed760]"
                  disabled={isLoading}
                >
                  Renvoyer le code
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Renvoyer le code dans {countdown}s
                </p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-semibold">
                Mot de passe *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 caractères"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleNext();
                    }
                  }}
                  required
                  autoFocus
                  className="bg-secondary border-none text-foreground placeholder:text-muted-foreground h-12 pr-12 focus-visible:ring-2 focus-visible:ring-[#1DB954]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground font-semibold">
                Confirmer le mot de passe *
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Retapez le mot de passe"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="bg-secondary border-none text-foreground placeholder:text-muted-foreground h-12 focus-visible:ring-2 focus-visible:ring-[#1DB954]"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="avatar" className="text-foreground font-semibold">
                Avatar *
              </Label>
              <div className="flex flex-col items-center gap-6 py-4">
                {avatarPreview ? (
                  <div className="relative">
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-[#1DB954]"
                    />
                    <button
                      type="button"
                      onClick={removeAvatar}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors shadow-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center border-4 border-dashed border-border">
                    <Upload className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <div className="w-full">
                  <Input
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="bg-secondary border-none text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1DB954] file:text-black hover:file:bg-[#1ed760] file:cursor-pointer cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-2 text-center">PNG, JPG, GIF jusqu'à 5MB</p>
                </div>
              </div>
            </div>
          </div>
        );

      // Étape 5: Documents KYC
      case 5:
        return (
          <div className="space-y-5">
            <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 mb-4">
              <p className="text-blue-400 text-sm">
                📋 Pour créer votre compte créateur, nous devons vérifier votre identité. Vos documents seront traités de manière confidentielle.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cin_number" className="text-foreground font-semibold">
                Numéro de CIN <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cin_number"
                name="cin_number"
                type="text"
                placeholder="Numéro de votre carte d'identité"
                value={formData.cin_number}
                onChange={handleChange}
                autoFocus
                className="bg-secondary border-none text-foreground placeholder:text-muted-foreground h-12 focus-visible:ring-2 focus-visible:ring-[#1DB954]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground font-semibold">
                Photo CIN Recto <span className="text-red-500">*</span>
              </Label>
              {cinRectoPreview ? (
                <div className="relative">
                  <img 
                    src={cinRectoPreview} 
                    alt="CIN Recto" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeCinImage('recto')}
                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-[#1DB954] transition-colors bg-secondary">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Cliquez pour uploader (max 5MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleCinImageUpload(e, 'recto')}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-foreground font-semibold">
                Photo CIN Verso <span className="text-red-500">*</span>
              </Label>
              {cinVersoPreview ? (
                <div className="relative">
                  <img 
                    src={cinVersoPreview} 
                    alt="CIN Verso" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeCinImage('verso')}
                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-[#1DB954] transition-colors bg-secondary">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Cliquez pour uploader (max 5MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleCinImageUpload(e, 'verso')}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-foreground font-semibold">
                Selfie avec CIN <span className="text-red-500">*</span>
              </Label>
              <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-3 mb-2">
                <p className="text-blue-400 text-xs">
                  📸 Prenez un selfie en tenant votre CIN dans votre main droite, visage et CIN bien visibles
                </p>
              </div>
              
              {showCamera ? (
                <div className="space-y-3">
                  <div className="relative w-full h-64 bg-secondary rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
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
              ) : cinSelfiePreview ? (
                <div className="relative">
                  <img 
                    src={cinSelfiePreview} 
                    alt="Selfie avec CIN" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeCinImage('selfie')}
                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="absolute bottom-2 right-2 px-4 py-2 bg-[#1DB954] hover:bg-[#1ed760] rounded-lg text-white text-sm font-semibold transition-colors"
                  >
                    Reprendre
                  </button>
                </div>
              ) : (
                <Button
                  type="button"
                  onClick={startCamera}
                  className="w-full h-64 border-2 border-dashed border-border rounded-lg hover:border-[#1DB954] transition-colors bg-secondary text-muted-foreground hover:text-foreground flex flex-col items-center justify-center gap-3"
                >
                  <Camera className="w-10 h-10" />
                  <span className="text-base font-semibold">Ouvrir la caméra</span>
                  <span className="text-xs">Pour prendre votre selfie avec CIN</span>
                </Button>
              )}
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3">
              <p className="text-yellow-400 text-xs">
                ⚠️ Vos documents seront vérifiés sous 24-48h. Vous serez notifié par email du résultat.
              </p>
            </div>
          </div>
        );

      // Étape 6: Informations optionnelles
      case 6:
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="phone_number" className="text-foreground font-semibold">
                Téléphone
              </Label>
              <Input
                id="phone_number"
                name="phone_number"
                type="tel"
                placeholder="+261 34 00 000 00"
                value={formData.phone_number}
                onChange={handleChange}
                autoFocus
                className="bg-secondary border-none text-foreground placeholder:text-muted-foreground h-12 focus-visible:ring-2 focus-visible:ring-[#1DB954]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="speciality" className="text-foreground font-semibold">
                Spécialité
              </Label>
              <Input
                id="speciality"
                name="speciality"
                type="text"
                placeholder="Ex: Romans fantastiques, Science-fiction..."
                value={formData.speciality}
                onChange={handleChange}
                className="bg-secondary border-none text-foreground placeholder:text-muted-foreground h-12 focus-visible:ring-2 focus-visible:ring-[#1DB954]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="biography" className="text-foreground font-semibold">
                Biographie
              </Label>
              <Textarea
                id="biography"
                name="biography"
                placeholder="Parlez-nous de vous et de votre passion pour l'écriture..."
                value={formData.biography}
                onChange={handleChange}
                rows={4}
                className="bg-secondary border-none text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[#1DB954] resize-none"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Commençons par vos identifiants";
      case 2:
        return "Vérifiez votre email";
      case 3:
        return "Créez votre mot de passe";
      case 4:
        return "Ajoutez votre photo de profil";
      case 5:
        return "Vérification d'identité (KYC)";
      case 6:
        return "Complétez votre profil";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Votre email et pseudo pour vous identifier";
      case 2:
        return "Entrez le code de vérification envoyé par email";
      case 3:
        return "Choisissez un mot de passe sécurisé";
      case 4:
        return "Ajoutez une photo pour personnaliser votre profil";
      case 5:
        return "Documents nécessaires pour vérifier votre identité";
      case 6:
        return "Ces informations aideront les lecteurs à mieux vous connaître";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <img 
            src="/logo/logo-appistery-no.png" 
            alt="Appistery Logo" 
            className="w-12 h-12 object-contain"
          />
          <h1 className="font-bold text-3xl text-foreground">APPISTERY</h1>
        </div>

        <Card className="bg-card border-border shadow-2xl">
          <CardHeader className="space-y-4 text-center pb-6">
            {/* Progress Bar */}
            <div className="flex items-center justify-center gap-2 mb-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index + 1 <= currentStep
                      ? 'bg-[#1DB954] w-12'
                      : 'bg-border w-8'
                  }`}
                />
              ))}
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Étape {currentStep} sur {totalSteps}
            </div>
            
            <CardTitle className="text-2xl font-bold text-foreground">
              {getStepTitle()}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              {getStepDescription()}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit} onKeyDown={(e) => {
            // Empêcher TOUTE soumission par Enter sauf à la dernière étape
            if (e.key === 'Enter') {
              if (currentStep !== totalSteps) {
                e.preventDefault();
                e.stopPropagation();
                handleNext();
              }
            }
          }}>
            <CardContent className="space-y-6 px-8 min-h-[300px]">
              {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-400">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Render current step content */}
              {renderStepContent()}
            </CardContent>

            <CardFooter className="flex flex-col gap-4 px-8 pb-8 pt-4">
              {/* Navigation Buttons */}
              <div className="flex gap-3 w-full">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    onClick={handlePrevious}
                    variant="outline"
                    className="flex-1 bg-transparent border-border text-foreground hover:bg-gray-800 h-12 text-base rounded-full transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Retour
                  </Button>
                )}

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isLoading}
                    className={`bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold h-12 text-base rounded-full transition-all hover:scale-105 ${
                      currentStep > 1 ? 'flex-1' : 'w-full'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Chargement...
                      </>
                    ) : (
                      <>
                        Suivant
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    onClick={() => {
                      console.log('🟢 Bouton "Créer mon compte" cliqué');
                      canSubmitRef.current = true;
                    }}
                    className={`bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold h-12 text-base rounded-full transition-all hover:scale-105 ${
                      currentStep > 1 ? 'flex-1' : 'w-full'
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                    {isLoading ? 'Création...' : 'Créer mon compte'}
                  </Button>
                )}
              </div>

              <div className="w-full h-px bg-gray-800 my-2"></div>

              <p className="text-sm text-center text-muted-foreground">
                {t('creator.register.hasAccount')}{' '}
                <Link to="/creator/login" className="text-[#1DB954] hover:text-[#1ed760] font-semibold hover:underline">
                  {t('creator.register.login')}
                </Link>
              </p>

              <Link to="/" className="text-sm text-center text-muted-foreground hover:text-foreground transition-colors">
                ← {t('creator.register.backHome')}
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default CreatorRegister;
