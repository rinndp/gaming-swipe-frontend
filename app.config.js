export default {
    expo: {
        name: "GamingSwipe",
        slug: "gaming-swipe",
        scheme: "com.rinndp.gamingswipe",
        version: "1.0.0",
        originalFullName: "@rinndp/gaming-swipe",
        orientation: "portrait",
        icon: "./assets/icon.png",
        userInterfaceStyle: "dark",
        newArchEnabled: true,
        updates: {
            url: "https://u.expo.dev/3b0a8157-2bce-441b-ad97-aef53cefb0e9"
        },
        
        splash: {
            image: "./assets/splash-icon.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
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
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            package: "com.rinndp.gamingswipe",
            permissions: [
                "android.permission.RECORD_AUDIO"
            ],
            config: {
                googleSignIn: {
                    apiKey: process.env.GOOGLE_APY_KEY,
                    certificateHash: process.env.ANDROID_HASH
                }
            }
        },
        web: {
            favicon: "./assets/favicon.png"
        },
        plugins: [
            "expo-font",
            "expo-asset",
            "expo-secure-store",
            "expo-image-picker",
            "expo-web-browser"
        ],
        extra: {
            eas: {
                projectId: "3b0a8157-2bce-441b-ad97-aef53cefb0e9"
            },
            androidClientId: process.env.ANDROID_GOOGLE_ID,
            iosClientId: process.env.IOS_GOOGLE_ID,
            igdbClientId: process.env.IGDB_CLIENT_ID,
            igdbAuth: process.env.IGDB_AUTH,
        }
    }
};