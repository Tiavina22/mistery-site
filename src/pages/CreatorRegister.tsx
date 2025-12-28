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
import { Eye, EyeOff, Loader2 } from 'lucide-react';

function CreatorRegister() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
    biography: '',
    speciality: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError(t('creator.register.passwordMismatch'));
      return;
    }

    if (formData.password.length < 8) {
      setError(t('creator.register.passwordTooShort'));
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/creator/dashboard');
    } catch (err: any) {
      setError(err.message || t('creator.register.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <img 
            src="/logo/logo-appistery-no.png" 
            alt="Appistery Logo" 
            className="w-12 h-12 object-contain"
          />
          <h1 className="font-bold text-3xl text-white">APPISTERY</h1>
        </div>

        <Card className="bg-[#121212] border-none shadow-2xl">
          <CardHeader className="space-y-1 text-center pb-8">
            <CardTitle className="text-3xl font-bold text-white mb-2">
              {t('creator.register.title')}
            </CardTitle>
            <CardDescription className="text-gray-400 text-base">
              {t('creator.register.subtitle')}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 px-8">
              {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-400">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-semibold">
                    {t('creator.register.email')} *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="bg-[#3e3e3e] border-none text-white placeholder:text-gray-500 h-12 focus-visible:ring-2 focus-visible:ring-[#1DB954]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_number" className="text-white font-semibold">
                    {t('creator.register.phone')}
                  </Label>
                  <Input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    placeholder="+261 34 00 000 00"
                    value={formData.phone_number}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="bg-[#3e3e3e] border-none text-white placeholder:text-gray-500 h-12 focus-visible:ring-2 focus-visible:ring-[#1DB954]"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white font-semibold">
                    {t('creator.register.password')} *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 caractères"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="bg-[#3e3e3e] border-none text-white placeholder:text-gray-500 h-12 pr-12 focus-visible:ring-2 focus-visible:ring-[#1DB954]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      title={showPassword ? t('creator.login.hide') : t('creator.login.show')}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white font-semibold">
                    {t('creator.register.confirmPassword')} *
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Retapez le mot de passe"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="bg-[#3e3e3e] border-none text-white placeholder:text-gray-500 h-12 focus-visible:ring-2 focus-visible:ring-[#1DB954]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="speciality" className="text-white font-semibold">
                  {t('creator.register.speciality')}
                </Label>
                <Input
                  id="speciality"
                  name="speciality"
                  type="text"
                  placeholder={t('creator.register.specialityPlaceholder')}
                  value={formData.speciality}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="bg-[#3e3e3e] border-none text-white placeholder:text-gray-500 h-12 focus-visible:ring-2 focus-visible:ring-[#1DB954]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="biography" className="text-white font-semibold">
                  {t('creator.register.biography')}
                </Label>
                <Textarea
                  id="biography"
                  name="biography"
                  placeholder={t('creator.register.biographyPlaceholder')}
                  value={formData.biography}
                  onChange={handleChange}
                  disabled={isLoading}
                  rows={4}
                  className="bg-[#3e3e3e] border-none text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-[#1DB954] resize-none"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 px-8 pb-8 pt-6">
              <Button 
                type="submit" 
                className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold h-12 text-base rounded-full transition-all hover:scale-105" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                {isLoading ? t('creator.register.loading') : t('creator.register.button')}
              </Button>

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
