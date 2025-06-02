import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Feather, MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import { EventDetails } from '@/app/types/event';
import { Reservation } from '@/app/types/reservation';
import { Feedback } from '@/app/types/feedback';
import { useEffect, useState } from 'react';
import api from '@/app/api/client';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [events, setEvents] = useState<EventDetails[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const { t, i18n } = useTranslation();
  const { authState, onLogout } = useAuth();
  const navigation = useNavigation();
  

    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        if (authState?.authenticated && authState.user?.id) {
          const eventsResponse = await api.getEventsByUserId(authState.user.id);
          console.log('Events:', eventsResponse.data);
          setEvents(eventsResponse.data || []);
          const feedbacksResponse = await api.getAllFeedbacks();
          setFeedbacks(feedbacksResponse.data || []);
          console.log('Feedbacks:', feedbacksResponse.data);
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

    const loadParticipants = async () => {
        try {
          setLoading(true);
          setError(null);
          if (authState?.authenticated && authState.user?.id) {
            const participantsResponse = await api.getReservations();
            setReservations(participantsResponse.data || []);
            console.log('Participants:', participantsResponse.data);
          }
        } catch (err: any) {
          if (err.response && err.response.status === 404) {
            setReservations([]);
          } else {
            setError('Falha ao carregar seus participantes');
            setReservations([]);
          }
        } finally {
          setLoading(false);
        }
      };

    useEffect(() => {
        loadEvents();
        loadParticipants();
      }, [authState?.authenticated]);
  
  const stats = {
    totalEvents: events.length,
    upcomingEvents: events.filter(e => new Date(e.date) > new Date()).length,
    totalAttendees: reservations.filter(b => b.status === 'active').length,
    averageRating: (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1),
  };
  
  const renderEventItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.eventCard}
      onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
    >
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDate}>{item.date}</Text>
      </View>
      <Text style={styles.eventLocation}>{item.location}</Text>
      <View style={styles.attendanceBar}>
        <View style={[styles.attendanceFill, { width: `${(item.attendees / item.capacity) * 100}%` }]} />
      </View>
      <Text style={styles.attendanceText}>{item.attendees}/{item.capacity} participantes</Text>
    </TouchableOpacity>
  );
  
  const renderBookingItem = ({ item }) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingInfo}>
        <Text style={styles.bookingName}>{item.user.name}</Text>
        <Text style={styles.bookingEmail}>{item.user.email}</Text>
        <Text style={styles.bookingEvent}>
          Evento: {events.find(e => e.id === item.event_id)?.name || 'Desconhecido'}
        </Text>
      </View>
      <View style={[
        styles.reservationstatus, 
        item.status === 'validated' ? styles.statusConfirmed : styles.statusPending
      ]}>
        <Text style={styles.statusText}>{item.status === 'validated' ? 'Confirmado' : 'Pendente'}</Text>
      </View>
    </View>
  );
  
  const renderFeedbackItem = ({ item }) => (
    <View style={styles.feedbackCard}>
      <View style={styles.feedbackHeader}>
        <Text style={styles.feedbackAuthor}>{item.user.name}</Text>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, i) => (
            <AntDesign 
              key={i} 
              name={i < item.rating ? 'star' : 'staro'} 
              size={16} 
              color="#FFD700" 
            />
          ))}
        </View>
      </View>
      <Text style={styles.feedbackComment}>{item.comment}</Text>
      <Text style={styles.feedbackEvent}>
        Evento: {events.find(e => e.id === item.event_id)?.name || 'Desconhecido'}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Painel de Eventos</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Feather name="user" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      {/* Estatísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialIcons name="event" size={30} color="#4CAF50" />
          <Text style={styles.statValue}>{stats.totalEvents}</Text>
          <Text style={styles.statLabel}>Eventos</Text>
        </View>
        
        <View style={styles.statCard}>
          <MaterialIcons name="event-available" size={30} color="#2196F3" />
          <Text style={styles.statValue}>{stats.upcomingEvents}</Text>
          <Text style={styles.statLabel}>Próximos</Text>
        </View>
        
        <View style={styles.statCard}>
          <FontAwesome name="users" size={28} color="#FF9800" />
          <Text style={styles.statValue}>{stats.totalAttendees}</Text>
          <Text style={styles.statLabel}>Participantes</Text>
        </View>
        
        <View style={styles.statCard}>
          <AntDesign name="star" size={28} color="#FFD700" />
          <Text style={styles.statValue}>{stats.averageRating}</Text>
          <Text style={styles.statLabel}>Avaliação</Text>
        </View>
      </View>
      
      {/* Seção de Eventos */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximos Eventos</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Events')}>
            <Text style={styles.seeAll}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={events.slice(0, 2)}
          renderItem={renderEventItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      
      {/* Seção de Reservas */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Últimas Reservas</Text>
          <TouchableOpacity onPress={() => navigation.navigate('reservations')}>
            <Text style={styles.seeAll}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={reservations.slice(0, 3)}
          renderItem={renderBookingItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      </View>
      
      {/* Seção de Feedbacks */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Últimos Feedbacks</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Feedbacks')}>
            <Text style={styles.seeAll}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={feedbacks.slice(0, 2)}
          renderItem={renderFeedbackItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      </View>
      
      {/* Modal do Usuário */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Configurações</Text>
            <TouchableOpacity style={styles.modalOption} onPress={() => {}}>
              <Text>Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => {}}>
              <Text>Configurações</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={onLogout}>
              <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '23%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    color: '#2196F3',
    fontSize: 14,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    width: 250,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  eventTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
  },
  eventDate: {
    color: '#666',
    fontSize: 14,
  },
  eventLocation: {
    color: '#666',
    fontSize: 14,
    marginBottom: 10,
  },
  attendanceBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 5,
    overflow: 'hidden',
  },
  attendanceFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  attendanceText: {
    fontSize: 12,
    color: '#666',
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 3,
  },
  bookingEmail: {
    color: '#666',
    fontSize: 14,
    marginBottom: 3,
  },
  bookingEvent: {
    color: '#666',
    fontSize: 12,
  },
  bookingStatus: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusConfirmed: {
    backgroundColor: '#E8F5E9',
  },
  statusPending: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  feedbackCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  feedbackAuthor: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  feedbackComment: {
    color: '#333',
    fontSize: 14,
    marginBottom: 10,
  },
  feedbackEvent: {
    color: '#666',
    fontSize: 12,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#2196F3',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logoutText: {
    color: 'red',
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
  },
});