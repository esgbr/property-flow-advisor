
import React from "react";
import { HelpCircle, RefreshCw, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { Tooltip } from "@/components/ui/tooltip";

const DashboardHeader: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();

  const onRefresh = () => {
    toast({
      title: t("dashboard"),
      description: t("Dashboard refreshed!"),
      variant: "success",
      duration: 2500,
    });
    // Future: add actual refresh logic here!
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2 animate-fade-in">
      <div className="flex items-center gap-2">
        <span className="text-3xl font-bold">
          {t('welcomeBack')}, {preferences.name || t('investor')}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Tooltip content={t('Refresh')}>
          <Button aria-label={t("Refresh")} size="icon" variant="ghost" onClick={onRefresh}>
            <RefreshCw className="h-5 w-5" />
          </Button>
        </Tooltip>
        <Tooltip content={t('Help')}>
          <Button aria-label={t("Help")} size="icon" variant="ghost" onClick={() => navigate('/help')}>
            <HelpCircle className="h-5 w-5" />
          </Button>
        </Tooltip>
        <Tooltip content={preferences.name || t('profile')}>
          <Button aria-label={t("Profile")} size="icon" variant="ghost" onClick={() => navigate('/profile')}>
            {/* Show avatar if exists else fallback icon */}
            {preferences.avatarUrl ? (
              <img
                src={preferences.avatarUrl}
                alt={preferences.name || t('profile')}
                className="rounded-full w-7 h-7 object-cover border"
              />
            ) : (
              <User className="h-6 w-6" />
            )}
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default DashboardHeader;
