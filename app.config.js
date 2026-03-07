export default {
    expo: {
        name: "GamingSwipe",
        slug: "gaming-swipe",
        scheme: "com.rinndp.gamingswipe",
        version: "1.0.0",
        originalFullName: "@rinndp/gaming-swipe",
        orientation: "portrait",
        icon: "./assets/icon.png",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        updates: {
            url: "https://u.expo.dev/3b0a8157-2bce-441b-ad97-aef53cefb0e9",
            enabled: true,
            checkAutomatically: "ON_LOAD",
            fallbackToCacheTimeout: 0
        },
        
        splash: {
            image: "./assets/logo.png",
            resizeMode: "contain",
            backgroundColor: "#252544"
        },
        ios: {
            supportsTablet: true,
            runtimeVersion: "1.0.0",
            bundleIdentifier: "com.rinndp.gamingswipe",
            infoPlist: {
                ITSAppUsesNonExemptEncryption: false
            },
            config: {
                usesNonExemptEncryption: false
            }
        },
        android: {
            runtimeVersion: "1.0.0",
            jsEngine: "hermes",
            privacyPolicyUrl: "https://www.termsfeed.com/live/7f86ce7f-7566-454f-a8da-94d5f0007ef5",
            adaptiveIcon: {
                foregroundImage: "./assets/icon.png",
                backgroundColor: "#252544"
            },
            package: "com.rinndp.gamingswipe",
            permissions: [
                "android.permission.RECORD_AUDIO",
                "com.google.android.gms.permission.AD_ID" 
            ],
            config: {
                googleSignIn: {
                    apiKey: process.env.GOOGLE_APY_KEY,
                    certificateHash: process.env.ANDROID_HASH
                }
            },
            enableProguardInReleaseBuilds: true,
            enableShrinkResourcesInReleaseBuilds: true
        },
        web: {
            favicon: "./assets/favicon.png"
        },
        plugins: [
            "expo-font",
            "expo-asset",
            "expo-secure-store",
            "expo-image-picker",
            "expo-web-browser",
            "expo-video",
            [
                "react-native-google-mobile-ads",
                {
                  androidAppId: "ca-app-pub-6162111676440492~3645150748",
                  iosAppId: "ca-app-pub-3940256099942544~1458002511", 
                  delayAppMeasurementInit: true,
                }
            ]
        ],
        extra: {
            eas: {
                projectId: "3b0a8157-2bce-441b-ad97-aef53cefb0e9"
            },
        }
    }
};