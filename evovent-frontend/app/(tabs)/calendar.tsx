import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import axios from 'axios';
import { format } from 'date-fns';
import { api } from '../api/client'; // Certifique-se de que esta parte está configurada corretamente
import { useFocusEffect } from 'expo-router';

export default function CalendarScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false); // Definir o estado de refreshing

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events');
      const formattedEvents = response.data.map((event: any) => ({
        id: event.id,
        title: event.name,
        date: new Date(event.date),
        location: event.location,
        image: event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000', // fallback image
      }));
      setEvents(formattedEvents);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar eventos');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false); // Finaliza o estado de refreshing
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
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
      </View>

      {events.map((day) => (
      <View key={`${day.id}-${day.date.toISOString()}`} style={styles.dayContainer}>
        <Text style={styles.dateHeader}>
          {format(day.date, 'EEEE, MMMM d, yyyy')}
        </Text>
        <View key={day.id} style={styles.eventItem}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{day.time}</Text>
          </View>
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>{day.title}</Text>
            <Text style={styles.eventType}>{day.location}</Text>
          </View>
        </View>
      </View>
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
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#111827',
  },
  dayContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  dateHeader: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 12,
  },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timeContainer: {
    marginRight: 16,
  },
  timeText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#6366f1',
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  eventType: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
});
