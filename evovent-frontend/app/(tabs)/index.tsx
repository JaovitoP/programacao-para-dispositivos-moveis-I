import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl, TextInput, ActivityIndicator } from 'react-native';
import { MapPin, Clock } from 'lucide-react-native';
import { format } from 'date-fns';
import { Link, router, Tabs, useFocusEffect } from 'expo-router';
import api from '@/app/api/client';
import React, { useState, useCallback, useEffect } from 'react';
import CustomHeader from './customHeader';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { Event } from '@/app/types/event';
import { t } from 'i18next';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { authState } = useAuth();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const API_BASE_URL = 'http:///192.168.15.7:5000/api';
  useEffect(() => {
    if (authState?.authenticated && authState.user) {
      console.log('ID do usuário:', authState.user.id);
    }
  }, [authState]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await api.getEvents();
      
      const formattedEvents = response.data.map((event: any) => ({
        id: event.id,
        title: event.name,
        date: new Date(event.date),
        location: event.location,
        image: event.image 
    ? `${API_BASE_URL}${event.image}`  // Concatena com a URL base
    : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000'
      }));
      

      setEvents(formattedEvents);
      setFilteredEvents(formattedEvents);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar eventos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  
    if (query === '') {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter((event) =>
        event.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  };
  

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [])
  );

  const onRefresh = () => {
    loadEvents();
    setRefreshing(true);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#006147" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => loadEvents()}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('../../assets/images/icon.png')} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Create')}
          >
            <Ionicons name="add" size={16} color="#fff" style={styles.icon} />
            <Text style={styles.text}>{t('Novo Evento')}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>{t('Próximos Eventos')}</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={t('Buscar Eventos')}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {filteredEvents.length === 0 ? (
        <View style={styles.noResults}>
          <Text style={styles.noResultsText}>Nenhum evento encontrado</Text>
        </View>
      ) : (
        filteredEvents.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.eventCard}
            onPress={() => navigation.navigate('Details', { id: event.id })}
          >
            <Image source={{ uri: event.image }} style={styles.eventImage} />
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.eventDetails}>
                <View style={styles.detailRow}>
                  <Clock size={16} color="#6b7280" />
                  <Text style={styles.detailText}>
                    {format(event.date, 'dd/MM/yyyy HH:mm')}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <MapPin size={16} color="#6b7280" />
                  <Text style={styles.detailText}>{event.location}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#006147',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    color: '#fff',
    fontSize: 12,
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventImage: {
    width: '100%',
    height: 160,
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 8,
  },
  eventDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#6b7280',
  },
  searchContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontFamily: 'Inter_400Regular',
  },
  noResults: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    color: '#ff0000',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryText: {
    color: '#006147',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});