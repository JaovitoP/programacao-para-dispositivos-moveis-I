import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, Linking } from 'react-native';
import { LogOut, QrCode, Calendar, PieChart, Instagram, Linkedin, Globe, Facebook, Twitter } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/app/api/client';
import { User } from '@/app/types/user';

const languages = [
  { code: 'en', label: 'English', flag: 'https://flagcdn.com/w40/gb.png' },
  { code: 'pt', label: 'Português', flag: 'https://flagcdn.com/w40/br.png' },
  { code: 'esp', label: 'Español', flag: 'https://flagcdn.com/w40/es.png' },
];

export default function ProfileScreen() {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const { authState, onLogout } = useAuth();
  const { t, i18n } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState<User[]>([]);
  const navigation = useNavigation();

  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value)
      .then(() => {
        setCurrentLanguage(value);
        console.log('Language changed to:', value);
        setModalVisible(false);
      })
      .catch(() => {
        console.error('Error changing language:', value);
      });
  };

  const loadProfile = async () => {
      try {
        if (authState?.authenticated && authState.user?.id) {
          const userResponse = await api.getUserById(authState.user.id);
          console.log('User:', userResponse.data);
          setUser(userResponse.data || []);
        }
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          setUser([]);
        } else {
          console.error('Error loading user:', err);
          setUser([]);
        }
      } finally {
      }
    };

  useEffect(() => {
      loadProfile();
    }, [authState?.authenticated]);

  const navigateToMyReservations = () => {
    navigation.navigate('MyReservations', { userId: authState.user.id });
  };

  const navigateToMyEvents = () => {
    navigation.navigate('MyEvents', { userId: authState.user.id });
  };

  const navigateToDashboard = () => {
    navigation.navigate('Dashboard', { userId: authState.user.id });
  };

  const openSocialMedia = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };

  const selectedLanguage = languages.find(lang => lang.code === currentLanguage);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('Meu Perfil')}</Text>
        <TouchableOpacity 
          style={styles.languageSelector}
          onPress={() => setModalVisible(true)}
        >
          <Image source={{ uri: selectedLanguage.flag }} style={styles.flagIcon} />
          <Text style={styles.languageText}>Idioma</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profile}>
        <Text style={styles.name}>{t('Bem-Vindo')}, {authState.user.name}!</Text>
        <Text style={styles.email}>{authState.user.email}</Text>

        {user?.about && (
          <View style={styles.aboutContainer}>
            <Text style={styles.aboutText}>{user.about}</Text>
          </View>
        )}


        <View style={styles.socialContainer}>
        <View style={styles.socialIcons}>
          {user?.instagram_url && (
            <TouchableOpacity onPress={() => openSocialMedia(user.instagram_url)}>
              <Instagram size={24} color="#E1306C" />
            </TouchableOpacity>
          )}
          
          {user?.facebook_url && (
            <TouchableOpacity onPress={() => openSocialMedia(user.facebook_url)}>
              <Facebook size={24} color="#1877F2" />
            </TouchableOpacity>
          )}
          
          {user?.twitter_url && (
            <TouchableOpacity onPress={() => openSocialMedia(user.twitter_url)}>
              <Twitter size={24} color="#1DA1F2" />
            </TouchableOpacity>
          )}
          
          {user?.linkedin_url && (
            <TouchableOpacity onPress={() => openSocialMedia(user.linkedin_url)}>
              <Linkedin size={24} color="#0077B5" />
            </TouchableOpacity>
          )}
          
          {user?.website_url && (
            <TouchableOpacity onPress={() => openSocialMedia(user.website_url)}>
              <Globe size={24} color="#000000" />
            </TouchableOpacity>
          )}
        </View>
      </View>

        {/* Modal para selecionar idioma */}
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              {languages.map(lang => (
                <TouchableOpacity
                  key={lang.code}
                  style={styles.modalItem}
                  onPress={() => changeLanguage(lang.code)}
                >
                  <Image source={{ uri: lang.flag }} style={styles.flagIcon} />
                  <Text style={styles.languageText}>{lang.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={navigateToMyReservations}
        >
          <View style={styles.menuIcon}>
            <QrCode size={24} color="#6b7280" />
          </View>
          <Text style={styles.menuLabel}>{t('Minhas Reservas')}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={navigateToMyEvents}
        >
          <View style={styles.menuIcon}>
            <Calendar  size={24} color="#6b7280" />
          </View>
          <Text style={styles.menuLabel}>{t('Meus Eventos')}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={navigateToDashboard}
        >
          <View style={styles.menuIcon}>
            <PieChart  size={24} color="#6b7280" />
          </View>
          <Text style={styles.menuLabel}>{t('Dashboard')}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
        <LogOut size={24} color="#ef4444" />
        <Text style={styles.logoutText}>{t('Sair')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    marginTop: 12,
    width: 120,
  },
  flagIcon: {
    width: 24,
    height: 16,
    marginRight: 8,
    borderRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: 250,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  languageText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#374151',
  },
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  socialContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  socialTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 12,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 20,
  },
  socialButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    minWidth: 100,
  },
  socialText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#374151',
    marginTop: 8,
  },
  aboutContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    width: '100%',
  },
  aboutText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
});