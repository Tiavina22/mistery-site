import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import CreatorLayout from '@/components/CreatorLayout';

export default function CreatorSettings() {
  const navigate = useNavigate();
  const { author } = useAuth();
  const { t } = useLanguage();

  if (!author) {
    navigate('/creator/login');
    return null;
  }

  return (
    <CreatorLayout>
      {/* Content */}
      <main className="p-8 max-w-5xl">
        <h1 className="text-4xl font-bold text-white mb-8">{t('creator.settings.title')}</h1>
        
        <div className="space-y-6">
            {/* Account Settings */}
            <Card className="bg-[#181818] border-none">
              <CardHeader>
                <CardTitle className="text-white">{t('creator.settings.account')}</CardTitle>
                <CardDescription className="text-gray-400">
                  Informations de votre compte créateur
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-400">{t('creator.settings.email')}</Label>
                    <p className="text-lg font-medium text-white">{author.email}</p>
                  </div>
                  {author.speciality && (
                    <div>
                      <Label className="text-gray-400">{t('creator.settings.speciality')}</Label>
                      <p className="text-lg font-medium text-white">{author.speciality}</p>
                    </div>
                  )}
                  <div className="pt-4 border-t border-white/10">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-[#1DB954] hover:text-black hover:border-[#1DB954] font-bold">
                      Modifier le profil
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
    </CreatorLayout>
  );
}
