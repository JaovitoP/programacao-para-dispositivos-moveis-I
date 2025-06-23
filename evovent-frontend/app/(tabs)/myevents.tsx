import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { EventDetails } from '@/app/types/event';
import { Users } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import api from '@/app/api/client';

export default function MyEventsScreen() {
  const { authState } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<EventDetails[]>([]);
  const navigation = useNavigation();

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      if (authState?.authenticated && authState.user?.id) {
        const eventsResponse = await api.getEventsByUserId(authState.user.id);
        console.log('Events:', eventsResponse.data);
        setEvents(eventsResponse.data || []);
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setEvents([]);
      } else {
        setError('Falha ao carregar seus eventos');
        console.error('Error loading events:', err);
        setEvents([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [authState?.authenticated]);

  const handleViewParticipants = (eventId: string) => {
    console.log(`Ver participantes do evento ${eventId}`);
  };

  const navigateToParticipants = (eventId: Number) => {
    navigation.navigate('Participants', { eventId });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Você não tem eventos ainda</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {events.map(event => (
        <View key={event.id} style={styles.reservationCard}>
          {/* Adicione a Image aqui */}
          {event.image && (
            <Image 
              source={{ uri: `${process.env.EXPO_PUBLIC_API_IMG_URL}${event.image}` }}
              style={styles.eventImage}
              onError={(e) => console.log('Erro ao carregar imagem:', e.nativeEvent.error)}
            />
          )}
          
          <View style={styles.reservationDetails}>
            <Text style={styles.detailValue}>{event.name}</Text>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={[styles.detailValue, event.status === 'active' ? styles.statusActive : styles.statusInactive]}>
              {event.status === 'active' ? 'Ativo' : 'Inativo'}
            </Text>

            <Text style={styles.detailLabel}>Criado em:</Text>
            <Text style={styles.detailValue}>
              {format(new Date(event.created_at), 'dd/MM/yyyy HH:mm')}
            </Text>

            <TouchableOpacity 
              style={styles.participantsButton} 
              onPress={() => navigateToParticipants(Number(event.id))}
            >
              <Users size={18} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.participantsButtonText}>Ver Participantes</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
   eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    resizeMode: 'cover',
  },
    container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 40,
  },
  reservationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reservationDetails: {
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '600',
  },
  statusActive: {
    color: '#10b981',
  },
  statusInactive: {
    color: '#ef4444',
  },
  participantsButton: {
    marginTop: 10,
    backgroundColor: '#6366f1',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  participantsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
