import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import PlayerProfile from "./pages/PlayerProfile.tsx";
import PlayersPage from "./pages/PlayersPage.tsx";
import TournamentPage from "./pages/TournamentPage.tsx";
import ClubInfoPage from "./pages/ClubInfoPage.tsx";
import ClubRulesPage from "./pages/ClubRulesPage.tsx";
import NewsPage from "./pages/NewsPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import MainAdminLogin from "./pages/MainAdminLogin.tsx";
import ClubAdminLogin from "./pages/ClubAdminLogin.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import LiveDrawPage from "./pages/LiveDrawPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/player/:id" element={<PlayerProfile />} />
            <Route path="/tournament" element={<TournamentPage />} />
            <Route path="/club-info" element={<ClubInfoPage />} />
            <Route path="/rules" element={<ClubRulesPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/login" element={<MainAdminLogin />} />
            <Route path="/admin/club-login" element={<ClubAdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/live-draw" element={<LiveDrawPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
