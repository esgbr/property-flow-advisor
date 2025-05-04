
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.6176f48fb3914c71b68ce2f6bdb01db7',
  appName: 'property-flow-advisor',
  webDir: 'dist',
  server: {
    url: 'https://6176f48f-b391-4c71-b68c-e2f6bdb01db7.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreAliasPassword: undefined,
    }
  }
};

export default config;
