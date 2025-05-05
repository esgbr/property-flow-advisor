
/**
 * Utility-Funktionen für deutsche Immobilien-Berechnungen
 */

// Berechnet die Grunderwerbsteuer basierend auf dem Bundesland
export const calculateGrunderwerbsteuer = (kaufpreis: number, bundesland: string): number => {
  const steuersaetze: Record<string, number> = {
    'by': 3.5, // Bayern
    'sn': 3.5, // Sachsen
    'hh': 4.5, // Hamburg
    'bw': 5.0, // Baden-Württemberg
    'hb': 5.0, // Bremen
    'ni': 5.0, // Niedersachsen
    'rp': 5.0, // Rheinland-Pfalz
    'st': 5.0, // Sachsen-Anhalt
    'be': 6.0, // Berlin
    'he': 6.0, // Hessen
    'mv': 6.0, // Mecklenburg-Vorpommern
    'bb': 6.5, // Brandenburg
    'nw': 6.5, // Nordrhein-Westfalen
    'sl': 6.5, // Saarland
    'sh': 6.5, // Schleswig-Holstein
    'th': 6.5  // Thüringen
  };

  const steuersatz = steuersaetze[bundesland] || 5.0; // Fallback auf 5%
  return (kaufpreis * steuersatz) / 100;
};

// AfA-Sätze für verschiedene Gebäudetypen und Baujahre
export interface AfaOption {
  id: string;
  rateDe: string;
  rateEn: string;
  value: number;
  description?: string;
}

export const getAfaOptions = (): AfaOption[] => {
  return [
    { 
      id: 'standard', 
      rateDe: '2% (50 Jahre)', 
      rateEn: '2% (50 years)', 
      value: 2,
      description: 'Standard AfA für Gebäude ab 2024'
    },
    { 
      id: 'pre1925', 
      rateDe: '2.5% (40 Jahre)', 
      rateEn: '2.5% (40 years)', 
      value: 2.5,
      description: 'Für Gebäude, die vor 1925 errichtet wurden'
    },
    { 
      id: 'new2023', 
      rateDe: '3% (33.33 Jahre)', 
      rateEn: '3% (33.33 years)', 
      value: 3,
      description: 'Beschleunigte AfA für neue Wohngebäude (§ 7b EStG)'
    },
    { 
      id: 'commercial', 
      rateDe: '3% (33.33 Jahre)', 
      rateEn: '3% (33.33 years)', 
      value: 3,
      description: 'Für Gewerbeimmobilien'
    },
    { 
      id: 'commercial-pre1925', 
      rateDe: '2.5% (40 Jahre)', 
      rateEn: '2.5% (40 years)', 
      value: 2.5,
      description: 'Für gewerbliche Altbauten vor 1925'
    }
  ];
};

// Berechnet die jährliche AfA
export const calculateAfa = (
  gebaeudewert: number, 
  afaTyp: string, 
  modernisierungskosten: number = 0
): number => {
  const afaOptions = getAfaOptions();
  const selectedOption = afaOptions.find(option => option.id === afaTyp);
  const afaSatz = selectedOption?.value || 2; // Default auf 2%
  
  // Gesamtwert (Gebäudewert + Modernisierungskosten)
  const gesamtwert = gebaeudewert + modernisierungskosten;
  
  // Jährliche AfA
  return (gesamtwert * afaSatz) / 100;
};

// Funktionen zur Berechnung typischer Nebenkosten beim Immobilienkauf
export const calculateNebenkosten = (
  kaufpreis: number, 
  bundesland: string,
  makelorCourtage: number = 3.57, // üblicherweise 3,57% inkl. MwSt.
  notar: number = 1.5, // üblicherweise 1-2%
  grundbuch: number = 0.5 // üblicherweise 0,5%
): {
  grunderwerbsteuer: number,
  makelorCourtage: number,
  notar: number,
  grundbuch: number,
  gesamtNebenkosten: number,
  gesamtKosten: number,
  nebenkostenProzent: number
} => {
  const grunderwerbsteuerBetrag = calculateGrunderwerbsteuer(kaufpreis, bundesland);
  const makelorCourtageBetrag = (kaufpreis * makelorCourtage) / 100;
  const notarBetrag = (kaufpreis * notar) / 100;
  const grundbuchBetrag = (kaufpreis * grundbuch) / 100;
  
  const gesamtNebenkosten = grunderwerbsteuerBetrag + makelorCourtageBetrag + notarBetrag + grundbuchBetrag;
  const gesamtKosten = kaufpreis + gesamtNebenkosten;
  const nebenkostenProzent = (gesamtNebenkosten / kaufpreis) * 100;
  
  return {
    grunderwerbsteuer: grunderwerbsteuerBetrag,
    makelorCourtage: makelorCourtageBetrag,
    notar: notarBetrag,
    grundbuch: grundbuchBetrag,
    gesamtNebenkosten,
    gesamtKosten,
    nebenkostenProzent
  };
};

// Berechnet die Wirtschaftlichkeit einer Immobilieninvestition
export const calculateRentability = (
  kaufpreis: number,
  nebenkosten: number,
  monatsmiete: number,
  nebenkosten_jaehrlich: number,
  eigenkapital: number = 0
): {
  gesamtinvestition: number,
  jahresmiete: number,
  jahresrendite_brutto: number,
  jahresrendite_netto: number,
  monatsrendite_netto: number,
  kapitalrendite: number
} => {
  const gesamtinvestition = kaufpreis + nebenkosten;
  const jahresmiete = monatsmiete * 12;
  const jahresrendite_brutto = (jahresmiete / gesamtinvestition) * 100;
  const jahresrendite_netto = ((jahresmiete - nebenkosten_jaehrlich) / gesamtinvestition) * 100;
  const monatsrendite_netto = jahresrendite_netto / 12;
  
  // Berechnung der Eigenkapitalrendite, falls Eigenkapital angegeben wurde
  const kapitalrendite = eigenkapital > 0 
    ? ((jahresmiete - nebenkosten_jaehrlich) / eigenkapital) * 100 
    : 0;
  
  return {
    gesamtinvestition,
    jahresmiete,
    jahresrendite_brutto,
    jahresrendite_netto,
    monatsrendite_netto,
    kapitalrendite
  };
};

// Wertsteigerungsrechner
export const calculateAppreciation = (
  kaufpreis: number,
  wertsteigerung_prozent: number,
  jahre: number
): number => {
  return kaufpreis * Math.pow(1 + wertsteigerung_prozent / 100, jahre);
};

// Daten für Mietspiegel in verschiedenen deutschen Städten (Beispieldaten)
export interface MietspiegelData {
  stadt: string;
  durchschnittsmiete_qm: number; // pro m²
  spanne_min: number;
  spanne_max: number;
  jahr: number;
}

// Beispieldaten für den Mietspiegel
export const getMietspiegelData = (): MietspiegelData[] => {
  return [
    { stadt: 'Berlin', durchschnittsmiete_qm: 12.79, spanne_min: 9.50, spanne_max: 18.00, jahr: 2023 },
    { stadt: 'München', durchschnittsmiete_qm: 19.75, spanne_min: 15.00, spanne_max: 25.00, jahr: 2023 },
    { stadt: 'Hamburg', durchschnittsmiete_qm: 14.82, spanne_min: 11.00, spanne_max: 21.00, jahr: 2023 },
    { stadt: 'Köln', durchschnittsmiete_qm: 13.20, spanne_min: 10.00, spanne_max: 18.50, jahr: 2023 },
    { stadt: 'Frankfurt', durchschnittsmiete_qm: 15.90, spanne_min: 12.00, spanne_max: 22.00, jahr: 2023 },
    { stadt: 'Stuttgart', durchschnittsmiete_qm: 14.60, spanne_min: 11.50, spanne_max: 20.00, jahr: 2023 },
    { stadt: 'Düsseldorf', durchschnittsmiete_qm: 13.76, spanne_min: 10.50, spanne_max: 19.00, jahr: 2023 },
    { stadt: 'Leipzig', durchschnittsmiete_qm: 8.40, spanne_min: 6.50, spanne_max: 12.00, jahr: 2023 },
    { stadt: 'Dresden', durchschnittsmiete_qm: 8.90, spanne_min: 7.00, spanne_max: 12.50, jahr: 2023 },
    { stadt: 'Nürnberg', durchschnittsmiete_qm: 11.50, spanne_min: 9.00, spanne_max: 15.00, jahr: 2023 }
  ];
};
