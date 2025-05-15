
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Receipt, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const NextStepsCard: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  return (
    <Card className="border-primary/20 hover:shadow-md transition-all">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ArrowRight className="h-5 w-5 mr-2 text-primary" />
          {language === "de" ? "Nächste Schritte" : "Next Steps"}
        </CardTitle>
        <CardDescription>
          {language === "de"
            ? "Empfohlene Aktionen für Ihre Investitionsstrategie"
            : "Recommended actions for your investment strategy"}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <Button
          variant="outline"
          className="flex items-center justify-between w-full h-auto py-3 px-4 group"
          onClick={() => navigate("/investor-dashboard?tab=market")}
        >
          <div className="flex items-center">
            <Search className="h-5 w-5 mr-3 text-primary" />
            <div className="text-left">
              <div className="font-medium">
                {language === "de"
                  ? "Marktanalyse durchführen"
                  : "Conduct Market Analysis"}
              </div>
              <p className="text-sm text-muted-foreground">
                {language === "de"
                  ? "Neue Chancen entdecken"
                  : "Discover new opportunities"}
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>

        <Button
          variant="outline"
          className="flex items-center justify-between w-full h-auto py-3 px-4 group"
          onClick={() => navigate("/investor-dashboard?tab=tax")}
        >
          <div className="flex items-center">
            <Receipt className="h-5 w-5 mr-3 text-primary" />
            <div className="text-left">
              <div className="font-medium">
                {language === "de"
                  ? "Steuerplanung optimieren"
                  : "Optimize Tax Planning"}
              </div>
              <p className="text-sm text-muted-foreground">
                {language === "de"
                  ? "Steuervorteile maximieren"
                  : "Maximize tax advantages"}
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default NextStepsCard;
