
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Filter, Building, Home, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample opportunities data
const opportunities = [
  {
    id: 1,
    name: 'Westside Development',
    type: 'Multi-Family',
    location: 'Westview',
    roi: 8.2,
    capRate: 6.5,
    price: 2450000,
    risk: 'Medium',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Downtown Condo Complex',
    type: 'Condominium',
    location: 'Central',
    roi: 7.5,
    capRate: 5.8,
    price: 3750000,
    risk: 'Low',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Suburban Office Building',
    type: 'Commercial',
    location: 'Greenfield',
    roi: 9.1,
    capRate: 7.2,
    price: 5200000,
    risk: 'Medium',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Riverside Apartments',
    type: 'Multi-Family',
    location: 'Riverside',
    roi: 8.7,
    capRate: 6.9,
    price: 4100000,
    risk: 'Low',
    status: 'Pending'
  },
  {
    id: 5,
    name: 'Tech Park Office Space',
    type: 'Commercial',
    location: 'Techville',
    roi: 7.8,
    capRate: 6.1,
    price: 6800000,
    risk: 'High',
    status: 'Active'
  }
];

const MarketOpportunitiesTable: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOpportunities, setFilteredOpportunities] = useState(opportunities);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query) {
      setFilteredOpportunities(opportunities);
    } else {
      setFilteredOpportunities(
        opportunities.filter(
          (opp) => 
            opp.name.toLowerCase().includes(query) ||
            opp.type.toLowerCase().includes(query) ||
            opp.location.toLowerCase().includes(query)
        )
      );
    }
  };

  const getRiskBadgeClass = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-purple-100 text-purple-800';
      case 'sold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>{t('investmentOpportunities')}</CardTitle>
            <CardDescription>{t('currentMarketOpportunities')}</CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchOpportunities')}
                className="pl-8"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>{t('all')}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{t('residential')}</DropdownMenuItem>
                <DropdownMenuItem>{t('commercial')}</DropdownMenuItem>
                <DropdownMenuItem>{t('multifamily')}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{t('highestROI')}</DropdownMenuItem>
                <DropdownMenuItem>{t('lowestRisk')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('propertyName')}</TableHead>
                <TableHead>{t('type')}</TableHead>
                <TableHead>{t('location')}</TableHead>
                <TableHead className="text-right">{t('roi')}</TableHead>
                <TableHead className="text-right">{t('capRate')}</TableHead>
                <TableHead className="text-right">{t('price')}</TableHead>
                <TableHead>{t('risk')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead className="w-24">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOpportunities.map((opp) => (
                <TableRow key={opp.id}>
                  <TableCell className="font-medium">{opp.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {opp.type === 'Multi-Family' || opp.type === 'Condominium' ? (
                        <Home className="h-4 w-4 mr-1 text-muted-foreground" />
                      ) : (
                        <Building className="h-4 w-4 mr-1 text-muted-foreground" />
                      )}
                      {opp.type}
                    </div>
                  </TableCell>
                  <TableCell>{opp.location}</TableCell>
                  <TableCell className="text-right font-medium">
                    <div className="flex items-center justify-end">
                      <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                      {opp.roi}%
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{opp.capRate}%</TableCell>
                  <TableCell className="text-right">€{opp.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskBadgeClass(opp.risk)}`}>
                      {opp.risk}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(opp.status)}`}>
                      {opp.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        {t('view')}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketOpportunitiesTable;
