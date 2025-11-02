import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BooksProvider } from './contexts/BooksContext';
import { AppThemeProvider } from './contexts/AppThemeContext';
import { HeaderBackButton } from '@react-navigation/elements';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AppThemeProvider>
      <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <BooksProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="book/bookDetail" 
              options={{ 
                headerShown: true,
                headerTitle: "Détails du livre",
                headerStyle: {
                  backgroundColor: 'rgba(15, 111, 119, 0.9)', 
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }} 
            />
            <Stack.Screen 
              name="book/edit/bookEdit" 
              options={{ 
                headerShown: true,
                headerTitle: "Modifier le livre", 
                headerStyle: {
                  backgroundColor: 'rgba(15, 111, 119, 0.9)', 
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }} 
            />
            <Stack.Screen 
              name="book/new" 
              options={{ 
                headerShown: true,
                headerTitle: "Nouveau Livre",
                headerStyle: {
                  backgroundColor: 'rgba(15, 111, 119, 0.9)', 
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                headerBackTitle: 'Retour',
              }}               
            />
               <Stack.Screen 
              name="stats" 
              options={{ 
                headerShown: true,
                headerTitle: "Statistiques",
                headerStyle: {
                  backgroundColor: 'rgba(15, 111, 119, 0.9)', 
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                headerBackTitle: 'Retour',
              }} 
            />

          <Stack.Screen 
              name="settings" 
              options={{ 
                headerShown: true,
                headerTitle: "Paramètres",
                headerStyle: {
                  backgroundColor: 'rgba(15, 111, 119, 0.9)', 
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                headerBackTitle: 'Retour',
              }} 
            />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </BooksProvider>
      </NavigationThemeProvider>
    </AppThemeProvider>
  );
}