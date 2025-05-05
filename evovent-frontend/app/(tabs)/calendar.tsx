import { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import axios from 'axios';
import { format } from 'date-fns';
import { api } from '../api/client';
import { useFocusEffect } from 'expo-router';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { t } from 'i18next';

export default function CalendarScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events');
      const formattedEvents = response.data.map((event: any) => ({
        id: event.id,
        title: event.name,
        date: new Date(event.date),
        location: event.location,
        image: event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000',
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

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [])
  );

  // Formatação correta para o react-native-calendars
  const markedDates = events.reduce((acc: any, event) => {
    const dateKey = format(event.date, 'yyyy-MM-dd');
    acc[dateKey] = {
      marked: true,
      dotColor: 'red',
    };
    return acc;
  }, {});

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
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => {
          const selectedDate = day.dateString;
          const dayEvents = events.filter(event => 
            format(event.date, 'yyyy-MM-dd') === selectedDate
          );
          
          if (dayEvents.length > 0) {
            alert(dayEvents.map(event => `${event.title} - ${event.location}`).join('\n'));
          } else {
            alert('Nenhum evento nesta data');
          }
        }}
        markedDates={markedDates}
      />

      <ScrollView 
        style={styles.eventList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t('Eventos')}</Text>
        </View>

        {events.map((event) => (
          <View key={event.id} style={styles.eventItem}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDate}>{format(event.date, 'dd/MM/yyyy')}</Text>
            <Text style={styles.eventType}>{event.location}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    padding: 20,
    paddingTop: 20,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#111827',
  },
  eventList: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  eventItem: {
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
  eventTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  eventDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  eventType: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
});