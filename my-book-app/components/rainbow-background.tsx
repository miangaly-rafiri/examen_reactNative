import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { useAppTheme } from '../app/contexts/AppThemeContext';

type ColorValue = string;

export const RainbowBackground = ({ children }: { children: ReactNode }) => {
    const { isDarkMode } = useAppTheme();

    const gradientColors: readonly [ColorValue, ColorValue, ColorValue] = isDarkMode 
    ? ['rgba(0, 30, 40, 1)', 'rgba(10, 50, 60, 1)', 'rgba(5, 35, 45, 1)'] 
    : ['rgba(30, 150, 160, 0.9)', 'rgba(50, 180, 190, 0.95)', 'rgba(20, 120, 130, 1)'];

    return (
        <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
        >
            {children}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
});