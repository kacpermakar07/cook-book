import * as dotenv from 'dotenv';
import { ConfigContext, ExpoConfig } from 'expo/config';

const AppVersion = {
  major: 1,
  minor: 0,
  patch: 0,
  versionCode: 1,
};

dotenv.config();

const EXPO_PUBLIC_ENV = process.env.EXPO_PUBLIC_ENV ?? 'DEV';
const appVersion = `${AppVersion.major}.${AppVersion.minor}.${AppVersion.patch}`;

const safeEnvGet = (value: string | undefined, message: string): string => {
  if (!value) throw new Error(message);
  return value;
};

const getAppConfig = () => {
  const buildType = safeEnvGet(EXPO_PUBLIC_ENV, 'Missing EXPO_PUBLIC_ENV env variable');

  switch (buildType) {
    case 'DEV':
      return {
        appName: '[D] Cook Book',
        iosBundleIdentifier: 'com.cookbook.app.dev',
        androidPackage: 'com.cookbook.app.dev',
        apiUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
      };
    // Odkomentuj i uzupełnij, gdy powstanie środowisko produkcyjne z prawdziwym backendem:
    // case 'PROD':
    //   return {
    //     appName: 'Cook Book',
    //     iosBundleIdentifier: 'com.cookbook.app',
    //     androidPackage: 'com.cookbook.app',
    //     apiUrl: '[prod-api-url]',
    //   };
    default:
      throw new Error(`Build type: ${buildType}, not supported`);
  }
};

const { appName, androidPackage, iosBundleIdentifier, apiUrl } = getAppConfig();

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: appName,
  version: appVersion,
  slug: 'cook-book',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'automatic',
  ios: {
    buildNumber: AppVersion.versionCode.toString(),
    bundleIdentifier: iosBundleIdentifier,
    icon: './assets/expo.icon',
    supportsTablet: true,
    infoPlist: { ITSAppUsesNonExemptEncryption: false },
  },
  android: {
    versionCode: AppVersion.versionCode,
    package: androidPackage,
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  extra: {
    API_URL: apiUrl,
    ENV: safeEnvGet(EXPO_PUBLIC_ENV, 'Missing EXPO_PUBLIC_ENV env variable'),
  },
  plugins: [
    'expo-router',
    'expo-font',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#208AEF',
        image: './assets/images/splash-icon.png',
        imageWidth: 76,
      },
    ],
  ],
  experiments: { typedRoutes: true, reactCompiler: true },
});
