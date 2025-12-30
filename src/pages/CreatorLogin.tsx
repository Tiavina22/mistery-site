import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function CreatorLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/creator/dashboard');
    } catch (err: any) {
      setError(err.message || t('creator.login.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
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
              {t('creator.login.title')}
            </CardTitle>
            <CardDescription className="text-gray-400 text-base">
              {t('creator.login.subtitle')}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 px-8">
              {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-400">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-semibold">
                  {t('creator.login.email')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-[#3e3e3e] border-none text-white placeholder:text-gray-500 h-12 focus-visible:ring-2 focus-visible:ring-[#1DB954]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-semibold">
                  {t('creator.login.password')}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="flex justify-end">
                <Link 
                  to="/creator/forgot-password" 
                  className="text-sm text-gray-400 hover:text-[#1DB954] transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 px-8 pb-8 pt-6">
              <Button 
                type="submit" 
                className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold h-12 text-base rounded-full transition-all hover:scale-105" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                {isLoading ? t('creator.login.loading') : t('creator.login.button')}
              </Button>

              <div className="w-full h-px bg-gray-800 my-2"></div>

              <p className="text-sm text-center text-gray-400">
                {t('creator.login.noAccount')}{' '}
                <Link to="/creator/register" className="text-[#1DB954] hover:text-[#1ed760] font-semibold hover:underline">
                  {t('creator.login.register')}
                </Link>
              </p>

              <Link to="/" className="text-sm text-center text-gray-400 hover:text-white transition-colors">
                ← {t('creator.login.backHome')}
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
