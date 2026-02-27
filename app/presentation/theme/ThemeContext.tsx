// app/presentation/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { getBackgroundColorAsync, setBackgroundColorAsync } from 'expo-system-ui';


type ThemeType = 'default' | 'light';

interface ThemeColors {
    black: string;      
    white: string;
    opacWhite: string;
    backgroundColor: string;
    blue: string;
    like: string;
    nope: string;
    secondaryColor: string;
    thirdColor: string;
    neonPurpleTransparent: string;
    buttonBackground: string;
    lighterButtonBackground: string;
    darkPurpleTrasparent: string;
    transparent: string;
    red: string;
    orange: string;
    green: string;
    gray: string;
    softWhite: string;
    genreBackground: string;
    focusSearchTabColor: string;
    changePhotoButton: string;
}

interface ThemeContextType {
  theme: ThemeType;
  colors: ThemeColors;
  setTheme: (theme: ThemeType) => void;
}

const themes: Record<ThemeType, ThemeColors> = {
  default: {
    black: "#FF000000" ,
    white:"#ffffff",
    opacWhite: "rgba(255,255,255,0.45)",
    backgroundColor: "#121315",
    blue:"#0583F2",
    like:"#0583F2",
    nope:"#c50a0a",
    secondaryColor:"#403475",
    thirdColor: "#19114b",
    neonPurpleTransparent:"rgba(2,4,24,0.38)",
    buttonBackground:"#252544",
    lighterButtonBackground:"rgba(44,44,80,0.82)",
    darkPurpleTrasparent:"rgba(19,1,33,0.6)",
    transparent:"#00000000",
    red:"#c50a0a",
    orange:"#ce6b1a",
    green:"#4bc00f",
    gray: "#797878",
    softWhite: "rgba(215,207,255,0.6)",
    genreBackground: "#403475",
    focusSearchTabColor: "#403475",
    changePhotoButton: "#403475",
    },

  light: {
    black: "#FFFFFF" ,
    white:"#000000",
    opacWhite: "rgba(255,255,255,0.45)",
    backgroundColor: "#FFFFFF",
    blue:"#0583F2",
    like:"rgb(133, 132, 134)",
    nope:"rgb(133, 132, 134)",
    secondaryColor:"#FFFFFF",
    thirdColor: "#F0F0F0",
    neonPurpleTransparent:"rgba(2,4,24,0.38)",
    buttonBackground:"#F0F0F0",
    lighterButtonBackground:"rgba(222, 222, 222, 0.82)",
    darkPurpleTrasparent:"rgba(19,1,33,0.6)",
    transparent:"#00000000",
    red:"#c50a0a",
    orange:"rgb(133, 132, 134)",
    green:"#3F9911",
    gray: "#797878",
    softWhite: "rgba(215,207,255,0.6)",
    genreBackground: "#F0F0F0",
    focusSearchTabColor: "#000000",
    changePhotoButton: "#F0F0F0",
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeType>('default');

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('app_theme');
      if (savedTheme) {
        setThemeState(savedTheme as ThemeType);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    const updateSystemTheme = async () => {
      const currentTheme = themes[theme];


      await setBackgroundColorAsync(currentTheme.backgroundColor);


      if (Platform.OS === 'android') {
        await NavigationBar.setButtonStyleAsync(
          theme === 'light' ? 'dark' : 'light'
        );
      }

      const color = await getBackgroundColorAsync();
      console.log(color);
    };
    updateSystemTheme();
  }, [theme]);

  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem('app_theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, colors: themes[theme], setTheme }}>
      <StatusBar style={theme === 'light' ? 'dark' : 'light'} />

      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};