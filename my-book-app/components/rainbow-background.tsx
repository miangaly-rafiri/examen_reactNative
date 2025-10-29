import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';

export const RainbowBackground = ({ children }: { children: ReactNode }) => {
    return (
        <LinearGradient
            colors={['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD']}
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