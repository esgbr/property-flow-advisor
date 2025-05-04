
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-foreground mb-6">
          {t('pageNotFound') || "Oops! Page not found"}
        </p>
        <p className="text-muted-foreground mb-8">
          {t('pageNotFoundDescription') || "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."}
        </p>
        <Button 
          onClick={() => navigate("/")} 
          size="lg"
          className="gap-2"
        >
          <Home className="h-4 w-4" />
          {t('returnToHome') || "Return to Home"}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
