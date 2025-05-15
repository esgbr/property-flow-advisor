
import React from "react";
import { RefreshCw, HelpCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const DashboardHeader: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();

  const onRefresh = () => {
    toast({
      title: t("dashboard"),
      description: t("Dashboard refreshed!"),
      variant: "default",
      duration: 2500,
    });
    // Future: add actual refresh logic here!
  };

  // Helper to render user icon or initial letter as avatar fallback
  const renderProfileIcon = () => {
    if (preferences.name) {
      return (
        <span
          className="rounded-full w-7 h-7 flex items-center justify-center bg-muted font-bold text-base uppercase border"
          aria-label={preferences.name.charAt(0)}
        >
          {preferences.name.charAt(0)}
        </span>
      );
    }
    return <User className="h-6 w-6" aria-label={t("profile")} />;
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2 animate-fade-in">
      <a href="#main-content" className="absolute left-2 top-2 bg-primary text-white px-3 py-1 rounded z-50 focus:outline-none focus:ring-2 focus:ring-primary transition-all opacity-80 hover:opacity-100 sr-only focus:not-sr-only">
        {t('skipToContent') || "Skip to Content"}
      </a>
      <div className="flex items-center gap-2">
        <span className="text-3xl font-bold">
          {t('welcomeBack')}, {preferences.name || t('investor')}
        </span>
      </div>
      <nav className="flex items-center gap-3" aria-label={t("dashboardQuickActions")}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label={t("Refresh")}
              size="icon"
              variant="ghost"
              onClick={onRefresh}
              tabIndex={0}
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('Refresh')}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label={t("Help")}
              size="icon"
              variant="ghost"
              onClick={() => navigate('/help')}
              tabIndex={0}
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('Help')}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label={t("Profile")}
              size="icon"
              variant="ghost"
              onClick={() => navigate('/profile')}
              tabIndex={0}
            >
              {renderProfileIcon()}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{preferences.name || t('profile')}</TooltipContent>
        </Tooltip>
      </nav>
    </header>
  );
};

export default DashboardHeader;
