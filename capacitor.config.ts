
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.6176f48fb3914c71b68ce2f6bdb01db7',
  appName: 'PropertyFlow Advisor',
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
  },
  // iOS specific configuration
  ios: {
    contentInset: 'always',
    scheme: 'app.lovable.propertyflow',
    limitsNavigationsToAppBoundDomains: true,
  },
  // General app settings
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP"
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
