
/**
 * Sichere Speicherung für sensible Daten in der App
 * Vereinfacht die Verschlüsselung und Entschlüsselung von Daten
 */

// Einfache Verschlüsselungsmethode (für Produktionsanwendungen sollte eine richtige Verschlüsselungsbibliothek verwendet werden)
const encryptData = (data: string, encryptionKey: string): string => {
  try {
    // Sehr einfache XOR-Verschlüsselung als Beispiel
    // In einer echten App würde man eine richtige Verschlüsselungsbibliothek verwenden
    const encrypted = Array.from(data)
      .map((char, i) => {
        const keyChar = encryptionKey[i % encryptionKey.length];
        return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
      })
      .join('');
    
    // Base64-Kodierung für die Speicherung
    return btoa(encrypted);
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
};

// Entsprechende Entschlüsselungsmethode
const decryptData = (encryptedData: string, encryptionKey: string): string => {
  try {
    // Base64-Dekodierung
    const encrypted = atob(encryptedData);
    
    // XOR-Entschlüsselung
    const decrypted = Array.from(encrypted)
      .map((char, i) => {
        const keyChar = encryptionKey[i % encryptionKey.length];
        return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
      })
      .join('');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
};

// Generieren eines Verschlüsselungsschlüssels aus Benutzer- und Geräteinformationen
const generateEncryptionKey = (): string => {
  // In einer echten App würde man hier Hardware-Identifikatoren verwenden
  const userAgent = navigator.userAgent;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const screenSize = `${window.screen.width}x${window.screen.height}`;
  
  // Kombinieren der Informationen für einen einzigartigen Schlüssel
  return btoa(`${userAgent}-${timeZone}-${screenSize}`).substring(0, 32);
};

// Speicherklasse für den sicheren Zugriff auf den lokalen Speicher
export class SecureStorage {
  private encryptionKey: string;
  private storagePrefix: string;
  
  constructor(storagePrefix = 'secure') {
    this.encryptionKey = generateEncryptionKey();
    this.storagePrefix = storagePrefix;
  }
  
  // Speichern von Daten
  setItem(key: string, value: any): void {
    try {
      const fullKey = `${this.storagePrefix}_${key}`;
      const valueString = typeof value === 'object' ? JSON.stringify(value) : String(value);
      const encryptedValue = encryptData(valueString, this.encryptionKey);
      
      localStorage.setItem(fullKey, encryptedValue);
    } catch (error) {
      console.error(`Error storing secure data for ${key}:`, error);
    }
  }
  
  // Abrufen von Daten
  getItem(key: string, defaultValue: any = null): any {
    try {
      const fullKey = `${this.storagePrefix}_${key}`;
      const encryptedValue = localStorage.getItem(fullKey);
      
      if (!encryptedValue) return defaultValue;
      
      const decryptedValue = decryptData(encryptedValue, this.encryptionKey);
      
      // Versuchen, als JSON zu parsen, ansonsten als Zeichenfolge zurückgeben
      try {
        return JSON.parse(decryptedValue);
      } catch {
        return decryptedValue;
      }
    } catch (error) {
      console.error(`Error retrieving secure data for ${key}:`, error);
      return defaultValue;
    }
  }
  
  // Entfernen von Daten
  removeItem(key: string): void {
    try {
      const fullKey = `${this.storagePrefix}_${key}`;
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.error(`Error removing secure data for ${key}:`, error);
    }
  }
  
  // Alle gespeicherten Daten dieses Präfixes löschen
  clear(): void {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(`${this.storagePrefix}_`))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing secure storage:', error);
    }
  }
}

// Instance für App-weite Verwendung exportieren
export const secureStorage = new SecureStorage('propertyflow');

export default secureStorage;
