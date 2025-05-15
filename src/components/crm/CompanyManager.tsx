import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Users } from 'lucide-react';

type Company = {
  id: string;
  name: string;
  type: string;
  phone?: string;
};

const demoCompanies: Company[] = [
  { id: "1", name: "Müller Hausverwaltung", type: "Property Manager", phone: "+49 30 1234567" },
  { id: "2", name: "Schmidt Bau GmbH", type: "Contractor", phone: "+49 89 7654321" },
];

const CompanyManager: React.FC = () => {
  const [selected, setSelected] = useState<Company | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Companies</CardTitle>
        <CardDescription>Manage your real estate related companies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-[300px] w-full text-sm">
            <thead>
              <tr className="text-muted-foreground">
                <th className="py-2 px-2 text-left">Name</th>
                <th className="py-2 px-2 text-left">Type</th>
                <th className="py-2 px-2 text-left">Phone</th>
                <th className="py-2 px-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {demoCompanies.map((company) => (
                <tr key={company.id} className="border-b hover:bg-muted/30">
                  <td className="py-2 px-2">{company.name}</td>
                  <td className="py-2 px-2">{company.type}</td>
                  <td className="py-2 px-2">{company.phone}</td>
                  <td className="py-2 px-2">
                    <Button size="sm" variant="outline" onClick={() => setSelected(company)}>View details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selected && (
            <div className="mt-6 p-4 bg-muted rounded">
              <h4 className="font-semibold mb-2 flex gap-2 items-center">
                <Users className="h-4 w-4" /> Company Details
              </h4>
              <div>Name: <b>{selected.name}</b></div>
              <div>Type: {selected.type}</div>
              <div>Phone: {selected.phone}</div>
              {/* Here show linked contacts and tasks in future */}
              <Button size="sm" className="mt-4" onClick={() => setSelected(null)}>Close</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyManager;
