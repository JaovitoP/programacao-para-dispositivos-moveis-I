import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Settings, Bell, Calendar, Heart, LogOut, QrCode } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

import {} from '../i18n'

import { useTranslation } from 'react-i18next'
import { t } from 'i18next';

export default function ProfileScreen() {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const {t, i18n} = useTranslation();

  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value)
    .then( () => {
      setCurrentLanguage(value);
      console.log('Language changed to:', value);
    })
    .catch( () => {
      console.error('Error changing language:', value);
    })
  }
  const { authState, onLogout } = useAuth();
  const navigation = useNavigation();

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    }
  };

  const navigateToMyEvents = () => {
    navigation.navigate('MyEvents', { userId: authState.user.id });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('Meu Perfil')}</Text>
      </View>

      <View style={styles.profile}>
        <Text style={styles.name}>{t('Bem-Vindo')}, {authState.user.name}!</Text>
        <Text style={styles.email}>{authState.user.email}</Text>
        <View style={styles.languageSwitcher}>
  <TouchableOpacity 
    onPress={() => changeLanguage('en')} 
    style={[
      styles.languageButton,
      currentLanguage === 'en' && styles.languageButtonActive
    ]}
  >
    <Text style={[
      styles.languageText,
      currentLanguage === 'en' && styles.languageTextActive
    ]}>English</Text>
  </TouchableOpacity>

  <TouchableOpacity 
    onPress={() => changeLanguage('pt')} 
    style={[
      styles.languageButton,
      currentLanguage === 'pt' && styles.languageButtonActive
    ]}
  >
    <Text style={[
      styles.languageText,
      currentLanguage === 'pt' && styles.languageTextActive
    ]}>Português</Text>
  </TouchableOpacity>

  <TouchableOpacity 
    onPress={() => changeLanguage('esp')} 
    style={[
      styles.languageButton,
      currentLanguage === 'esp' && styles.languageButtonActive
    ]}
  >
    <Text style={[
      styles.languageText,
      currentLanguage === 'esp' && styles.languageTextActive
    ]}>Espanhol</Text>
  </TouchableOpacity>
</View>


      </View>

      <View style={styles.menu}>
  <TouchableOpacity 
    style={styles.menuItem}
    onPress={navigateToMyEvents}
  >
    <View style={styles.menuIcon}>
      <QrCode size={24} color="#6b7280" />
    </View>
    <Text style={styles.menuLabel}>{t('Minhas Reservas')}</Text>
  </TouchableOpacity>
</View>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <LogOut size={24} color="#ef4444" />
        <Text style={styles.logoutText}>{t('Sair')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  languageSwitcher: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  languageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
  },
  languageButtonActive: {
    backgroundColor: '#6366f1',
  },
  languageText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#374151',
  },
  languageTextActive: {
    color: '#ffffff',
  },
  
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#111827',
  },
  profile: {
    backgroundColor: '#ffffff',
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 24,
    color: '#111827',
    marginBottom: 4,
  },
  email: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },
  stats: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#e5e7eb',
  },
  statNumber: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#6366f1',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#6b7280',
  },
  menu: {
    backgroundColor: '#ffffff',
    marginTop: 20,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#374151',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 20,
    marginBottom: 40,
  },
  logoutText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#ef4444',
    marginLeft: 8,
  },
});