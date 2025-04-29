
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import PropertyEdit from "./pages/PropertyEdit";
import Calculators from "./pages/Calculators";
import Schedule from "./pages/Schedule";
import Refurbishment from "./pages/Refurbishment";
import Decision from "./pages/Decision";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AppLockProvider } from "./contexts/AppLockContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AppLockProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="properties" element={<Properties />} />
                <Route path="property/:id" element={<PropertyDetail />} />
                <Route path="property/:id/edit" element={<PropertyEdit />} />
                <Route path="calculators" element={<Calculators />} />
                <Route path="schedule" element={<Schedule />} />
                <Route path="refurbishment" element={<Refurbishment />} />
                <Route path="decision" element={<Decision />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppLockProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
