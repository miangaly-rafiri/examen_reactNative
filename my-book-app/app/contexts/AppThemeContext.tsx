import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AppTheme = 'light' | 'dark' | 'auto';

interface AppThemeContextType {
    appTheme: AppTheme;
    isDarkMode: boolean;
    setAppTheme: (theme: AppTheme) => void;
}

const AppThemeContext = createContext<AppThemeContextType | undefined>(undefined);

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
    const systemColorScheme = useColorScheme();
    const [appTheme, setAppThemeState] = useState<AppTheme>('auto');


    const isDarkMode = appTheme === 'auto' 
        ? systemColorScheme === 'dark'
        : appTheme === 'dark';
    useEffect(() => {
        loadSavedTheme();
    }, []);

    const loadSavedTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('app_theme');
            if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
                setAppThemeState(savedTheme as AppTheme);
            }
        } catch (error) {
            console.error('Erreur chargement thème:', error);
        }
    };

    const setAppTheme = async (theme: AppTheme) => {
        try {
            setAppThemeState(theme);
            await AsyncStorage.setItem('app_theme', theme);
        } catch (error) {
            console.error('Erreur sauvegarde thème:', error);
        }
    };

    return (
        <AppThemeContext.Provider value={{ appTheme, isDarkMode, setAppTheme }}>
            {children}
        </AppThemeContext.Provider>
    );
};


export const useAppTheme = () => {
    const context = useContext(AppThemeContext);
    if (context === undefined) {
        throw new Error('useAppTheme must be used within an AppThemeProvider');
    }
    return context;
};