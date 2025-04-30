import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { MapPin, Clock } from 'lucide-react-native';
import { format } from 'date-fns';
import { Link, useFocusEffect } from 'expo-router';
import api from '@/app/api/client';
import React, { useState, useCallback } from 'react';
import CustomHeader from './customHeader';

interface Event {
  id: string;
  title: string;
  date: Date;
  location: string;
  image: string;
}

export default function HomeScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await api.getEvents();
      const formattedEvents = response.data.map((event: any) => ({
        id: event.id,
        title: event.name,
        date: new Date(event.date),
        location: event.location,
        image: event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000' // fallback image
      }));
      setEvents(formattedEvents);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar eventos');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadEvents();
  };

// Atualiza sempre que a tela recebe foco
useFocusEffect(
  useCallback(() => {
    loadEvents();
  }, [])
);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <CustomHeader 
        userName="João Silva" 
        userPhoto="https://example.com/profile.jpg" 
      />
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, John!</Text>
        <Text style={styles.title}>Evovent | Próximos Eventos</Text>
      </View>

      {events.map((event) => (
        <Link key={event.id} href={`/${event.id}`} asChild>
          <TouchableOpacity style={styles.eventCard}>
            <Image source={{ uri: event.image }} style={styles.eventImage} />
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.eventDetails}>
                <View style={styles.detailRow}>
                  <Clock size={16} color="#6b7280" />
                  <Text style={styles.detailText}>
                    {format(event.date, 'MMM d, yyyy h:mm a')}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <MapPin size={16} color="#6b7280" />
                  <Text style={styles.detailText}>{event.location}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Link>
      ))}
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
  greeting: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#111827',
    marginBottom: 8,
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
});