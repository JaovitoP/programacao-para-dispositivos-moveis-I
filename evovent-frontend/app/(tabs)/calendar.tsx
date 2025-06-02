import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Image } from 'react-native';
import { format } from 'date-fns';
import { api } from '../api/client';
import { useFocusEffect } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import Modal from 'react-native-modal';
import { t } from 'i18next';

export default function CalendarScreen() {
  const currentDate = new Date();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<any[]>([]);

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

  const markedDates = events.reduce((acc: any, event) => {
    const dateKey = format(event.date, 'yyyy-MM-dd');
    acc[dateKey] = {
      marked: true,
      dotColor: 'red',
    };
    return acc;
  }, {});

  const openEventModal = (eventsForDay: any[]) => {
    setSelectedEvents(eventsForDay);
    setModalVisible(true);
  };

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
          openEventModal(dayEvents);
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
          <Text style={styles.title}>{t('Próximos Eventos')}</Text>
        </View>

        {events
          .filter(event => event.date >= currentDate)
          .map((event) => (
            <View key={event.id} style={styles.eventItem}>
              <Image 
                source={{ uri: event.image.startsWith('http') ? event.image : `http://192.168.15.7:5000${event.image}` }}
                style={styles.eventImage}
                resizeMode="cover"
              />
              <View style={styles.eventTextContainer}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDate}>{format(event.date, 'dd/MM/yyyy')}</Text>
                <Text style={styles.eventType}>{event.location}</Text>
              </View>
            </View>
          ))}
      </ScrollView>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Eventos do dia</Text>
          {selectedEvents.length > 0 ? (
            selectedEvents.map(event => (
              <View key={event.id} style={styles.modalItem}>
                <Image 
                  source={{ uri: event.image.startsWith('http') ? event.image : `http://192.168.15.7:5000${event.image}` }}
                  style={styles.modalImage}
                  resizeMode="cover"
                />
                <View style={styles.modalTextContainer}>
                  <Text style={styles.modalEventTitle}>{event.title}</Text>
                  <Text style={styles.modalEventLocation}>{event.location}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.modalEmptyText}>Nenhum evento nesta data</Text>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingTop: 30,
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
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  eventImage: {
    width: 80,
    height: 80,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  eventTextContainer: {
    flex: 1,
    padding: 12,
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
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111827',
  },
  modalItem: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  modalImage: {
    width: 60,
    height: 60,
  },
  modalTextContainer: {
    flex: 1,
    padding: 10,
  },
  modalEventTitle: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  modalEventLocation: {
    fontSize: 14,
    color: '#6b7280',
  },
  modalEmptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});