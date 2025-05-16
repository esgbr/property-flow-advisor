
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
  // Enhanced iOS specific configuration
  ios: {
    contentInset: 'always',
    scheme: 'app.lovable.propertyflow',
    limitsNavigationsToAppBoundDomains: true,
    backgroundColor: "#ffffff",
    preferredContentMode: 'mobile',
    preferredStatusBarStyle: 'default',
    allowsLinkPreview: true,
    handleApplicationNotifications: true,
    reloadForURLChanges: true,
  },
  // General app settings
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#9b87f5",
      iosSpinnerStyle: "small",
      splashFullScreen: true,
      splashImmersive: false
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    Keyboard: {
      resize: "body",
      style: "dark",
      resizeOnFullScreen: true,
      hideOnScroll: true
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#9b87f5"
    },
    CapacitorHttp: {
      enabled: true
    },
    CapacitorCookies: {
      enabled: true
    },
    Device: {
      overrideUserAgent: false
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#ffffff",
      overlaysWebView: false
    }
  }
};

export default config;
