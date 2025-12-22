import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { 
  LayoutDashboard,
  FileText,
  BarChart3,
  Bell,
  Home,
  LogOut,
  Settings,
  Globe,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CreatorSettings() {
  const navigate = useNavigate();
  const location = useLocation();
  const { author, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const sidebarItems = [
    { icon: LayoutDashboard, label: t('creator.dashboard.menu.dashboard'), path: '/creator/dashboard' },
    { icon: FileText, label: t('creator.dashboard.menu.stories'), path: '/creator/stories' },
    { icon: BarChart3, label: t('creator.dashboard.menu.analytics'), path: '/creator/analytics' },
    { icon: Bell, label: t('creator.dashboard.menu.notifications'), path: '/creator/notifications' },
    { icon: Settings, label: t('creator.dashboard.menu.settings'), path: '/creator/settings' },
  ];

  if (!author) {
    navigate('/creator/login');
    return null;
  }

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card hidden lg:flex flex-col fixed h-screen">
        {/* Logo */}
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-heading font-bold text-primary-foreground text-lg">A</span>
            </div>
            <span className="font-heading font-bold text-xl text-foreground">
              APPISTERY
            </span>
          </Link>
          <p className="text-xs text-muted-foreground mt-2">Espace Créateur</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={author.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {getInitials(author.email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{author.email}</p>
              <p className="text-xs text-muted-foreground truncate">
                {author.speciality || t('creator.dashboard.welcome')}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t('creator.dashboard.logout')}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Header */}
        <header className="border-b bg-card sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{t('creator.settings.title')}</h1>
                <p className="text-sm text-muted-foreground">
                  Personnalisez votre expérience
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate('/')}>
                <Home className="w-4 h-4 mr-2" />
                {t('creator.login.backHome')}
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 max-w-4xl">
          <div className="space-y-6">
            {/* Language Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  {t('creator.settings.language')}
                </CardTitle>
                <CardDescription>
                  {t('creator.settings.languageDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label>Langue préférée</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setLanguage('fr')}
                      className={cn(
                        "p-4 border-2 rounded-lg transition-all",
                        language === 'fr'
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">🇫🇷</div>
                        <div className="text-left">
                          <div className="font-semibold">Français</div>
                          <div className="text-sm text-muted-foreground">French</div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setLanguage('en')}
                      className={cn(
                        "p-4 border-2 rounded-lg transition-all",
                        language === 'en'
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">🇬🇧</div>
                        <div className="text-left">
                          <div className="font-semibold">English</div>
                          <div className="text-sm text-muted-foreground">Anglais</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  {t('creator.settings.theme')}
                </CardTitle>
                <CardDescription>
                  {t('creator.settings.themeDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label>Thème d'affichage</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setTheme('light')}
                      className={cn(
                        "p-4 border-2 rounded-lg transition-all",
                        theme === 'light'
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Sun className="w-8 h-8 text-yellow-500" />
                        <div className="font-semibold">{t('creator.settings.theme.light')}</div>
                        <div className="text-xs text-muted-foreground">{t('creator.settings.theme.lightDesc')}</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setTheme('dark')}
                      className={cn(
                        "p-4 border-2 rounded-lg transition-all",
                        theme === 'dark'
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Moon className="w-8 h-8 text-blue-500" />
                        <div className="font-semibold">{t('creator.settings.theme.dark')}</div>
                        <div className="text-xs text-muted-foreground">{t('creator.settings.theme.darkDesc')}</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setTheme('system')}
                      className={cn(
                        "p-4 border-2 rounded-lg transition-all",
                        theme === 'system'
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Monitor className="w-8 h-8 text-purple-500" />
                        <div className="font-semibold">{t('creator.settings.theme.system')}</div>
                        <div className="text-xs text-muted-foreground">{t('creator.settings.theme.systemDesc')}</div>
                      </div>
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Le thème système s'adapte automatiquement aux préférences de votre appareil
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle>{t('creator.settings.account')}</CardTitle>
                <CardDescription>
                  Informations de votre compte créateur
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">{t('creator.settings.email')}</Label>
                    <p className="text-lg font-medium">{author.email}</p>
                  </div>
                  {author.speciality && (
                    <div>
                      <Label className="text-muted-foreground">{t('creator.settings.speciality')}</Label>
                      <p className="text-lg font-medium">{author.speciality}</p>
                    </div>
                  )}
                  <div className="pt-4 border-t">
                    <Button variant="outline">
                      Modifier le profil
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
