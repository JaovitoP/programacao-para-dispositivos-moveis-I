import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Settings, Bell, Calendar, Heart, LogOut } from 'lucide-react-native';

const MENU_ITEMS = [
  {
    icon: Settings,
    label: 'Configurações',
    route: 'Configurações',
  },
  {
    icon: Bell,
    label: 'Notificações',
    route: 'Notificações',
  },
  {
    icon: Calendar,
    label: 'Meus Eventos',
    route: 'Meus Eventos',
  },
  {
    icon: Heart,
    label: 'Eventos Salvos',
    route: 'Eventos Salvos',
  },
];

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meu Perfil</Text>
      </View>

      <View style={styles.profile}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>john.doe@email.com</Text>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Eventos Criados</Text>
          </View>
          <View style={[styles.statItem]}>
            <Text style={styles.statNumber}>48</Text>
            <Text style={styles.statLabel}>Eventos Comparecidos</Text>
          </View>
        </View>
      </View>

      <View style={styles.menu}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity key={item.route} style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <item.icon size={24} color="#6b7280" />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <LogOut size={24} color="#ef4444" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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