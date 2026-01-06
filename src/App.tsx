import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import MisteryHome from "./pages/MisteryHome";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MisteryAbout from "./pages/MisteryAbout";
import MisteryTerms from "./pages/MisteryTerms";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Help from "./pages/Help";
import CreatorLogin from "./pages/CreatorLogin";
import CreatorRegister from "./pages/CreatorRegister";
import ForgotPassword from "./pages/ForgotPassword";
import CreatorDashboard from "./pages/CreatorDashboard";
import CreatorDashboardNew from "./pages/CreatorDashboardNew";
import CreatorSettings from "./pages/CreatorSettings";
import CreatorProfile from "./pages/CreatorProfile";
import CreateStory from "./pages/CreateStory";
import CreatorStories from "./pages/CreatorStories";
import CreatorStoriesNew from "./pages/CreatorStoriesNew";
import ManageChapters from "./pages/ManageChapters";
import CreatorAnalytics from "./pages/CreatorAnalytics";
import CreatorNotifications from "./pages/CreatorNotifications";
import CreatorVideos from "./pages/CreatorVideos";
import AdminLogin from "./pages/AdminLogin";
import AdminUsers from "./pages/AdminUsers";
import AdminAuthors from "./pages/AdminAuthors";
import AdminKYC from "./pages/AdminKYC";
import AdminPaymentMethods from "./pages/AdminPaymentMethods";
import AdminMobileMoneyProviders from "./pages/AdminMobileMoneyProviders";
import AdminNotifications from "./pages/AdminNotifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AdminProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<MisteryHome />} />
                  <Route path="/appistery" element={<Index />} />
                  <Route path="/about" element={<MisteryAbout />} />
                  <Route path="/terms" element={<MisteryTerms />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/creator/login" element={<CreatorLogin />} />
                  <Route path="/creator/register" element={<CreatorRegister />} />
                  <Route path="/creator/forgot-password" element={<ForgotPassword />} />
                  <Route path="/creator/dashboard" element={<CreatorDashboardNew />} />
                  <Route path="/creator/profile" element={<CreatorProfile />} />
                  <Route path="/creator/settings" element={<CreatorSettings />} />
                  <Route path="/creator/stories" element={<CreatorStoriesNew />} />
                  <Route path="/creator/story/new" element={<CreateStory />} />
                  <Route path="/creator/videos" element={<CreatorVideos />} />
                  <Route path="/creator/analytics" element={<CreatorAnalytics />} />
                  <Route path="/creator/notifications" element={<CreatorNotifications />} />
                  <Route path="/creator/stories/:storyId/chapters" element={<ManageChapters />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminUsers />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/authors" element={<AdminAuthors />} />
                  <Route path="/admin/kyc" element={<AdminKYC />} />
                  <Route path="/admin/payment-methods" element={<AdminPaymentMethods />} />
                  <Route path="/admin/mobile-money-providers" element={<AdminMobileMoneyProviders />} />
                  <Route path="/admin/notifications" element={<AdminNotifications />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AdminProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
