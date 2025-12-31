import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sun, Moon, Monitor } from 'lucide-react';
import CreatorLayout from '@/components/CreatorLayout';

export default function CreatorSettings() {
  const navigate = useNavigate();
  const { author } = useAuth();
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();

  if (!author) {
    navigate('/creator/login');
    return null;
  }

  return (
    <CreatorLayout>
      {/* Content */}
      <div className="p-8 max-w-5xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">{t('creator.settings.title')}</h1>
        
        <div className="space-y-6">
            {/* Account Settings */}
            <Card className="bg-card border-none">
              <CardHeader>
                <CardTitle className="text-foreground">{t('creator.settings.account')}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Informations de votre compte créateur
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">{t('creator.settings.email')}</Label>
                    <p className="text-lg font-medium text-foreground">{author.email}</p>
                  </div>
                  {author.speciality && (
                    <div>
                      <Label className="text-muted-foreground">{t('creator.settings.speciality')}</Label>
                      <p className="text-lg font-medium text-foreground">{author.speciality}</p>
                    </div>
                  )}
                  <div className="pt-4 border-t border-border">
                    <Button variant="outline" className="border-border text-foreground hover:bg-[#1DB954] hover:text-black hover:border-[#1DB954] font-bold">
                      Modifier le profil
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Theme Settings */}
            <Card className="bg-card border-none">
              <CardHeader>
                <CardTitle className="text-foreground">Thème</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Choisissez le thème de l'interface
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    onClick={() => setTheme('light')}
                    className={theme === 'light' ? 'bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold' : 'border-border text-foreground hover:bg-secondary'}
                  >
                    <Sun className="w-4 h-4 mr-2" />
                    Clair
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => setTheme('dark')}
                    className={theme === 'dark' ? 'bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold' : 'border-border text-foreground hover:bg-secondary'}
                  >
                    <Moon className="w-4 h-4 mr-2" />
                    Sombre
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    onClick={() => setTheme('system')}
                    className={theme === 'system' ? 'bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold' : 'border-border text-foreground hover:bg-secondary'}
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    Système
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </CreatorLayout>
  );
}
