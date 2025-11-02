import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { RainbowBackground } from '@/components/rainbow-background';
import { useBooks } from '../../app/contexts/BooksContext';
import { useAppTheme } from '../contexts/AppThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { offlineStorage } from '@/services/offlineStorage';

const SETTINGS_KEYS = {
  NOTIFICATIONS: 'settings_notifications',
  SYNC_AUTO: 'settings_sync_auto',
};

export default function SettingsScreen() {
  const { isOnline, syncPending, refreshBooks } = useBooks();
  const { appTheme, isDarkMode, setAppTheme } = useAppTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [storageInfo, setStorageInfo] = useState({
    booksCount: 0,
    syncQueueCount: 0,
    storageSize: '0 KB',
  });

  useEffect(() => {
    loadSettings();
    loadStorageInfo();
  }, []);

  const loadSettings = async () => {
    try {
      const [notifications, autoSync] = await Promise.all([
        AsyncStorage.getItem(SETTINGS_KEYS.NOTIFICATIONS),
        AsyncStorage.getItem(SETTINGS_KEYS.SYNC_AUTO),
      ]);

      setNotificationsEnabled(notifications === 'true');
      setAutoSyncEnabled(autoSync !== 'false');
    } catch (error) {
      console.error('Erreur chargement paramètres:', error);
    }
  };

  const loadStorageInfo = async () => {
    try {
      const [books, syncQueue] = await Promise.all([
        offlineStorage.loadBooks(),
        offlineStorage.getSyncQueue(),
      ]);

      const booksData = JSON.stringify(books);
      const syncData = JSON.stringify(syncQueue);
      const totalSize = new Blob([booksData + syncData]).size;
      
      setStorageInfo({
        booksCount: books.length,
        syncQueueCount: syncQueue.length,
        storageSize: formatBytes(totalSize),
      });
    } catch (error) {
      console.error('Erreur chargement info stockage:', error);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleNotificationsToggle = async (value: boolean) => {
    try {
      setNotificationsEnabled(value);
      await AsyncStorage.setItem(SETTINGS_KEYS.NOTIFICATIONS, value.toString());
    } catch (error) {
      console.error('Erreur sauvegarde paramètre notifications:', error);
    }
  };

  const handleAutoSyncToggle = async (value: boolean) => {
    try {
      setAutoSyncEnabled(value);
      await AsyncStorage.setItem(SETTINGS_KEYS.SYNC_AUTO, value.toString());
    } catch (error) {
      console.error('Erreur sauvegarde paramètre sync:', error);
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setAppTheme(newTheme);
  };

  const getThemeLabel = (themeValue: string) => {
    switch (themeValue) {
      case 'light': return 'Clair';
      case 'dark': return 'Sombre';
      case 'auto': return 'Automatique';
      default: return 'Automatique';
    }
  };

  const isThemeActive = (themeValue: string) => {
    return appTheme === themeValue;
  };


  const getDynamicStyles = (isDark: boolean) => {
    const backgroundColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.15)';
    const cardBackground = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.08)';
    const optionBackground = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)';
    const borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)';

    return StyleSheet.create({
      section: {
        margin: 16,
        padding: 16,
        borderRadius: 12,
        backgroundColor: backgroundColor,
      },
      statusCard: {
        backgroundColor: cardBackground,
        borderRadius: 8,
        padding: 12,
      },
      themeOption: {
        backgroundColor: optionBackground,
        padding: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'transparent',
      },
      themeOptionActive: {
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
        borderColor: '#4CAF50',
      },
      settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: borderColor,
      },
    });
  };

  const dynamicStyles = getDynamicStyles(isDarkMode);

  return (
    <RainbowBackground>
      <ScrollView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.headerTitle}>⚙️ Paramètres</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            {isOnline ? 'En ligne' : 'Mode hors ligne'}
            {syncPending && ' • Sync en attente'}
          </ThemedText>
        </ThemedView>

        <ThemedView style={dynamicStyles.section}>
          <ThemedText style={styles.sectionTitle}>Statut de l'application</ThemedText>
          
          <View style={dynamicStyles.statusCard}>
            <View style={styles.statusRow}>
              <ThemedText style={styles.statusLabel}>Connexion</ThemedText>
              <ThemedText style={[
                styles.statusValue,
                isOnline ? styles.online : styles.offline
              ]}>
                {isOnline ? 'En ligne' : 'Hors ligne'}
              </ThemedText>
            </View>
            
            <View style={styles.statusRow}>
              <ThemedText style={styles.statusLabel}>Synchronisation</ThemedText>
              <ThemedText style={styles.statusValue}>
                {syncPending ? 'En attente' : 'À jour'}
              </ThemedText>
            </View>
            
            <View style={styles.statusRow}>
              <ThemedText style={styles.statusLabel}>Livres stockés</ThemedText>
              <ThemedText style={styles.statusValue}>
                {storageInfo.booksCount} livre(s)
              </ThemedText>
            </View>
            
            <View style={styles.statusRow}>
              <ThemedText style={styles.statusLabel}>Opérations en attente</ThemedText>
              <ThemedText style={styles.statusValue}>
                {storageInfo.syncQueueCount}
              </ThemedText>
            </View>
            
            <View style={styles.statusRow}>
              <ThemedText style={styles.statusLabel}>Espace utilisé</ThemedText>
              <ThemedText style={styles.statusValue}>
                {storageInfo.storageSize}
              </ThemedText>
            </View>
          </View>
        </ThemedView>

        <ThemedView style={dynamicStyles.section}>
          <ThemedText style={styles.sectionTitle}>Apparence</ThemedText>
          
          <View style={styles.themeOptions}>
            <TouchableOpacity 
              style={[
                dynamicStyles.themeOption,
                isThemeActive('auto') && dynamicStyles.themeOptionActive
              ]}
              onPress={() => handleThemeChange('auto')}
            >
              <ThemedText style={[
                styles.themeOptionText,
                isThemeActive('auto') && styles.themeOptionTextActive
              ]}>
                🌗 Automatique
              </ThemedText>
              <ThemedText style={styles.themeOptionDescription}>
                Suit les paramètres système
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                dynamicStyles.themeOption,
                isThemeActive('light') && dynamicStyles.themeOptionActive
              ]}
              onPress={() => handleThemeChange('light')}
            >
              <ThemedText style={[
                styles.themeOptionText,
                isThemeActive('light') && styles.themeOptionTextActive
              ]}>
                ☀️ Clair
              </ThemedText>
              <ThemedText style={styles.themeOptionDescription}>
                Thème clair
              </ThemedText>
            </TouchableOpacity>
          </View>
          
          <ThemedText style={styles.currentTheme}>
            Thème actuel: {getThemeLabel(appTheme)} {isDarkMode ? '🌙' : '☀️'}
          </ThemedText>
        </ThemedView>

        <ThemedView style={dynamicStyles.section}>
          <ThemedText style={styles.sectionTitle}>Préférences</ThemedText>
          
          <View style={dynamicStyles.settingItem}>
            <View style={styles.settingText}>
              <ThemedText style={styles.settingLabel}>Notifications</ThemedText>
              <ThemedText style={styles.settingDescription}>
                Recevoir des notifications
              </ThemedText>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={notificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>

          <View style={dynamicStyles.settingItem}>
            <View style={styles.settingText}>
              <ThemedText style={styles.settingLabel}>Synchronisation automatique</ThemedText>
              <ThemedText style={styles.settingDescription}>
                Synchroniser automatiquement quand la connexion est rétablie
              </ThemedText>
            </View>
            <Switch
              value={autoSyncEnabled}
              onValueChange={handleAutoSyncToggle}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={autoSyncEnabled ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </ThemedView>
      </ScrollView>
    </RainbowBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  statusLabel: {
    fontSize: 14,
    opacity: 0.8,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  online: {
    color: '#4CAF50',
  },
  offline: {
    color: '#FF9800',
  },
  themeOptions: {
    gap: 8,
    marginBottom: 12,
  },
  themeOptionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  themeOptionTextActive: {
    color: '#4CAF50',
  },
  themeOptionDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
  currentTheme: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.8,
    marginTop: 8,
  },
  settingText: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
});