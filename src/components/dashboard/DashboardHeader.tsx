
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
      variant: "default", // Only "default" or "destructive" allowed
      duration: 2500,
    });
    // Future: add actual refresh logic here!
  };

  // Helper to render user icon or initial letter as avatar fallback
  const renderProfileIcon = () => {
    if (preferences.name) {
      return (
        <span className="rounded-full w-7 h-7 flex items-center justify-center bg-muted font-bold text-base uppercase border">
          {preferences.name.charAt(0)}
        </span>
      );
    }
    return <User className="h-6 w-6" />;
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2 animate-fade-in">
      <div className="flex items-center gap-2">
        <span className="text-3xl font-bold">
          {t('welcomeBack')}, {preferences.name || t('investor')}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button aria-label={t("Refresh")} size="icon" variant="ghost" onClick={onRefresh}>
              <RefreshCw className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('Refresh')}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button aria-label={t("Help")} size="icon" variant="ghost" onClick={() => navigate('/help')}>
              <HelpCircle className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('Help')}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button aria-label={t("Profile")} size="icon" variant="ghost" onClick={() => navigate('/profile')}>
              {renderProfileIcon()}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{preferences.name || t('profile')}</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default DashboardHeader;

