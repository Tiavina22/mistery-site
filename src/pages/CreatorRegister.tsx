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
import { Eye, EyeOff, Loader2, Upload, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

function CreatorRegister() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
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
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const canSubmitRef = useRef(false);

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
              <Label htmlFor="email" className="text-white font-semibold">
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
                className="bg-[#3e3e3e] border-none text-white placeholder:text-gray-500 h-12 focus-visible:ring-2 focus-visible:ring-[#1DB954]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pseudo" className="text-white font-semibold">
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
                className="bg-[#3e3e3e] border-none text-white placeholder:text-gray-500 h-12 focus-visible:ring-2 focus-visible:ring-[#1DB954]"
              />
              <p className="text-xs text-gray-500">Minimum 3 caractères, ce sera votre identifiant unique</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <p className="text-gray-400 text-sm mb-2">
                Un code de vérification a été envoyé à
              </p>
              <p className="text-white font-semibold">{formData.email}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otpCode" className="text-white font-semibold">
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
                className="bg-[#3e3e3e] border-none text-white placeholder:text-gray-500 h-12 text-center text-2xl font-bold tracking-widest focus-visible:ring-2 focus-visible:ring-[#1DB954]"
              />
              <p className="text-xs text-gray-500 text-center">Entrez le code à 6 chiffres</p>
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
                <p className="text-sm text-gray-500">
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
              <Label htmlFor="password" className="text-white font-semibold">
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
                  className="bg-[#3e3e3e] border-none text-white placeholder:text-gray-500 h-12 pr-12 focus-visible:ring-2 focus-visible:ring-[#1DB954]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white font-semibold">
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
                className="bg-[#3e3e3e] border-none text-white placeholder:text-gray-500 h-12 focus-visible:ring-2 focus-visible:ring-[#1DB954]"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="avatar" className="text-white font-semibold">
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
                  <div className="w-32 h-32 rounded-full bg-[#3e3e3e] flex items-center justify-center border-4 border-dashed border-gray-600">
                    <Upload className="w-12 h-12 text-gray-500" />
                  </div>
                )}
                <div className="w-full">
                  <Input
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="bg-[#3e3e3e] border-none text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1DB954] file:text-black hover:file:bg-[#1ed760] file:cursor-pointer cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">PNG, JPG, GIF jusqu'à 5MB</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="phone_number" className="text-white font-semibold">
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
                className="bg-[#3e3e3e] border-none text-white placeholder:text-gray-500 h-12 focus-visible:ring-2 focus-visible:ring-[#1DB954]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="speciality" className="text-white font-semibold">
                Spécialité
              </Label>
              <Input
                id="speciality"
                name="speciality"
                type="text"
                placeholder="Ex: Romans fantastiques, Science-fiction..."
                value={formData.speciality}
                onChange={handleChange}
                className="bg-[#3e3e3e] border-none text-white placeholder:text-gray-500 h-12 focus-visible:ring-2 focus-visible:ring-[#1DB954]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="biography" className="text-white font-semibold">
                Biographie
              </Label>
              <Textarea
                id="biography"
                name="biography"
                placeholder="Parlez-nous de vous et de votre passion pour l'écriture..."
                value={formData.biography}
                onChange={handleChange}
                rows={4}
                className="bg-[#3e3e3e] border-none text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-[#1DB954] resize-none"
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
        return "Ces informations aideront les lecteurs à mieux vous connaître";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <img 
            src="/logo/logo-appistery-no.png" 
            alt="Appistery Logo" 
            className="w-12 h-12 object-contain"
          />
          <h1 className="font-bold text-3xl text-white">APPISTERY</h1>
        </div>

        <Card className="bg-[#121212] border-none shadow-2xl">
          <CardHeader className="space-y-4 text-center pb-6">
            {/* Progress Bar */}
            <div className="flex items-center justify-center gap-2 mb-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index + 1 <= currentStep
                      ? 'bg-[#1DB954] w-12'
                      : 'bg-gray-700 w-8'
                  }`}
                />
              ))}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              Étape {currentStep} sur {totalSteps}
            </div>
            
            <CardTitle className="text-2xl font-bold text-white">
              {getStepTitle()}
            </CardTitle>
            <CardDescription className="text-gray-400 text-sm">
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
                    className="flex-1 bg-transparent border-gray-700 text-white hover:bg-gray-800 h-12 text-base rounded-full transition-all"
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

              <p className="text-sm text-center text-gray-400">
                {t('creator.register.hasAccount')}{' '}
                <Link to="/creator/login" className="text-[#1DB954] hover:text-[#1ed760] font-semibold hover:underline">
                  {t('creator.register.login')}
                </Link>
              </p>

              <Link to="/" className="text-sm text-center text-gray-400 hover:text-white transition-colors">
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
