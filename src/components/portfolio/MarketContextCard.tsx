
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const MarketContextCard: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-primary" />
          {language === "de"
            ? "Portfolio im Marktkontext"
            : "Portfolio in Market Context"}
        </CardTitle>
        <CardDescription>
          {language === "de"
            ? "Vergleichen Sie Ihre Investitionen mit aktuellen Marktdaten"
            : "Compare your investments with current market data"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="performance">
              <LineChart className="mr-1 h-4 w-4" />
              {language === "de" ? "Performance" : "Performance"}
            </TabsTrigger>
            <TabsTrigger value="allocation">
              <PieChart className="mr-1 h-4 w-4" />
              {language === "de" ? "Aufteilung" : "Allocation"}
            </TabsTrigger>
            <TabsTrigger value="trends">
              <TrendingUp className="mr-1 h-4 w-4" />
              {language === "de" ? "Trends" : "Trends"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance">
            <div className="h-60 flex items-center justify-center bg-secondary/20 rounded-md">
              <div className="text-center">
                <div className="text-lg font-medium mb-2">
                  {language === "de" ? "Performance-Analyse" : "Performance Analysis"}
                </div>
                <p className="text-sm text-muted-foreground mb-4 max-w-md">
                  {language === "de"
                    ? "Analyse Ihrer Portfolio-Performance im Vergleich zum Markt"
                    : "Analysis of your portfolio performance compared to the market"}
                </p>
                <Button onClick={() => navigate("/portfolio-analytics")}>
                  {language === "de"
                    ? "Vollständige Analyse ansehen"
                    : "View Full Analysis"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="allocation">
            <div className="h-60 flex items-center justify-center bg-secondary/20 rounded-md">
              <div className="text-center">
                <div className="text-lg font-medium mb-2">
                  {language === "de"
                    ? "Portfolio-Aufteilung"
                    : "Portfolio Allocation"}
                </div>
                <p className="text-sm text-muted-foreground mb-4 max-w-md">
                  {language === "de"
                    ? "Analyse Ihrer aktuellen Portfolio-Aufteilung"
                    : "Analysis of your current portfolio allocation"}
                </p>
                <Button onClick={() => navigate("/portfolio-analytics?tab=allocation")}>
                  {language === "de"
                    ? "Zur Allokationsanalyse"
                    : "Go to Allocation Analysis"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends">
            <div className="h-60 flex items-center justify-center bg-secondary/20 rounded-md">
              <div className="text-center">
                <div className="text-lg font-medium mb-2">
                  {language === "de" ? "Markttrends" : "Market Trends"}
                </div>
                <p className="text-sm text-muted-foreground mb-4 max-w-md">
                  {language === "de"
                    ? "Aktuelle Trends und deren Einfluss auf Ihre Investitionen"
                    : "Current trends and their impact on your investments"}
                </p>
                <Button onClick={() => navigate("/market-explorer")}>
                  {language === "de" ? "Zu den Markttrends" : "View Market Trends"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MarketContextCard;
