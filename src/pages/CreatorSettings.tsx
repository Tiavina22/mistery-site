import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
            {/* Theme Settings */}
            <Card className="bg-card border-border">
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
