import { Modal, TextInput, View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity, Share, Button, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { MapPin, Clock, Users, Share2 } from 'lucide-react-native';
import api from '@/app/api/client';
import { useEffect, useState } from 'react';
import * as Sharing from 'expo-sharing';
import { Rating } from 'react-native-ratings';
import { useAuth } from '@/context/AuthContext';
import { Event, EventDetails } from '@/app/types/event';
import { Ticket } from '@/app/types/ticket';
import { Feedback } from '@/app/types/feedback';

const fetchCoordinates = async (address: string) => {
  const encodedAddress = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AppLoc/1.0 (meuemail@dominio.com)'
      }
    });

    if (!response.ok) {
      console.error(`Erro ao buscar coordenadas. Status: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      return { lat, lon };
    } else {
      console.error('Endereço não encontrado');
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar coordenadas:', error);
    return null;
  }
};

const calculateAverageRating = (feedbacks: Feedback[]) => {
  if (!feedbacks || feedbacks.length === 0) return 0;
  const sum = feedbacks.reduce((total, feedback) => total + feedback.rating, 0);
  return sum / feedbacks.length;
};

export default function EventDetailsScreen() {
  const { authState } = useAuth();
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: string, lon: string } | null>(null);
  const route = useRoute();
  const { id } = route.params as { id: string };
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

const [isReservationModalVisible, setIsReservationModalVisible] = useState(false);
const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
const [reservationQuantity, setReservationQuantity] = useState(1);


const generateReservationCode = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

const handleReserveTicket = async () => {
  try {
    if (!authState?.authenticated || !authState.user) {
      Alert.alert('Login necessário', 'Você precisa estar logado para fazer uma reserva');
      return;
    }

    if (!selectedTicket || !event) {
      Alert.alert('Erro', 'Dados incompletos para a reserva');
      return;
    }


    if (reservationQuantity < 1) {
      Alert.alert('Quantidade inválida', 'A quantidade deve ser pelo menos 1');
      return;
    }

    if (selectedTicket.amount < reservationQuantity) {
      Alert.alert('Quantidade indisponível', 'Não há ingressos suficientes disponíveis');
      return;
    }

    const reservationData = {
      user_id: authState.user.id,
      ticket_id: selectedTicket.id,
      amount: selectedTicket.amount,
      event_id: event.id,
      code: generateReservationCode(),
      status: 'active'
    };

    console.log('Dados da reserva sendo enviados:', reservationData);

    const response = await api.createReservation(reservationData);

    if (response.status === 201) {
      Alert.alert('Sucesso!', `Reserva realizada com sucesso! Seu código é: ${reservationData.code}`);
      setIsReservationModalVisible(false);
      setSelectedTicket(null);
      setReservationQuantity(1);
      
      // Atualizar a quantidade de ingressos disponíveis
      const updatedTickets = event?.tickets.map(ticket => {
        if (ticket.id === selectedTicket.id) {
          return {
            ...ticket,
            amount: ticket.amount - reservationQuantity
          };
        }
        return ticket;
      });
      
      if (event && updatedTickets) {
        setEvent({
          ...event,
          tickets: updatedTickets
        });
      }
    }
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    Alert.alert('Erro', 'Não foi possível realizar a reserva. Tente novamente.');
  }
};

const openReservationModal = (ticket: Ticket) => {
  setSelectedTicket(ticket);
  setIsReservationModalVisible(true);
};

  useEffect(() => {
    if (authState?.authenticated && authState.user) {
      console.log('ID do usuário:', authState.user.id);
      console.log('Dados completos do usuário:', authState.user);
    }
  }, [authState]);

  const handleRateEvent = async () => {
    try {
      if (rating === 0) {
        Alert.alert('Avaliação necessária', 'Por favor, selecione uma avaliação de 1 a 5 estrelas');
        return;
      }
      const userid = authState?.user?.id;
      console.log('Tentando enviar avaliação:', { id, rating, comment, userid });
      
      const feedbackData = {
        event_id: id, 
        rating: rating,
        comment: comment,
        user_id: userid, 
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const response = await api.createFeedback(feedbackData);

      if (response.status === 201) {
        Alert.alert('Obrigado!', 'Sua avaliação foi registrada com sucesso!');
        setIsRatingModalVisible(false);
        setRating(0);
        setComment('');
        loadEvent();
      }
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      Alert.alert('Erro', 'Não foi possível enviar sua avaliação. Tente novamente.');
    }
  };

  const loadEvent = async () => {
    try {
      setLoading(true);
      console.log('tentando pegar evento pelo id: ', id);
      const response = await api.getEventById(id as string);
      console.log(response.data);

      const ticketsResponse = await api.getTicketsByEventId(id);
      let feedbacks = [];
    try {
      const feedbacksResponse = await api.getFeedbacksByEventId(id);
      feedbacks = feedbacksResponse.data || [];
    } catch (feedbackError) {
      console.log('Nenhum feedback encontrado ou erro ao buscar feedbacks:', feedbackError);
      feedbacks = [];
    }

    setEvent({
      ...response.data,
      tickets: ticketsResponse.data || [],
      feedbacks
    });
    } catch (err: any) {
      setError('Failed to load event details');
    
      if (err.response) {
        console.error('Erro na resposta da API:', err.response.data);
        console.error('Status:', err.response.status);
      } else if (err.request) {
        console.error('Erro na requisição (sem resposta):', err.request);
      } else {
        console.error('Erro genérico:', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvent();
    const address = "Rua das Flores, 123, São Paulo";
    const loadCoordinates = async () => {
      const coords = await fetchCoordinates(address);
      if (coords) {
        setCoordinates(coords);
      }
    };
    loadCoordinates();
  }, [id]);

  const handleShare = async () => {
    try {
      const result = await Share.share({
        title: event?.name || 'Evento',
        message: `Olá, Venho te convidar para um evento!🎉\nVocê não pode perder a oportunidade participar! Confira: \n ${event?.name || 'Evento'}
        \nData: ${event ? format(new Date(event.date), 'EEEE, MMMM d, yyyy h:mm a') : 'Data indisponível'}
        \nLocal: ${event?.location || 'Local indisponível'}
        \nDescrição: ${event?.description || 'Descrição indisponível'}
        \nNão deixe de marcar na sua agenda, será uma experiência imperdível! E, claro, sinta-se à vontade para compartilhar com seus amigos. Quanto mais, melhor!😄\nNos vemos lá!`,
        url: event?.image || '',
      }, {
        dialogTitle: 'Compartilhar evento',
        subject: `Detalhes do evento: ${event?.name || 'Evento'}`,
      });
  
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Compartilhado via', result.activityType);
        } else {
          console.log('Compartilhado com sucesso');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Compartilhamento cancelado');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error || 'Event not found'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: event.color || '#f3f4f6' }]}>
      <Image 
        source={{ uri: event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000' }} 
        style={styles.coverImage} 
      />
      <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
        <Share2 size={24} color="#6366f1" />
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.title}>{event.name}</Text>
        <Text style={styles.sectionTitle}>{event.category}</Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Clock size={20} color="#6b7280" />
            <Text style={styles.infoText}>
              {format(new Date(event.date), 'EEEE, MMMM d, yyyy h:mm a')}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <MapPin size={20} color="#6b7280" />
            <Text style={styles.infoText}>{event.location}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <Text style={styles.description}>{event.description || 'Não há descrições'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localização</Text>
          <Text>{event.location}</Text>
        </View>

        {event.tickets && event.tickets.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingressos</Text>
            <View style={styles.ticketsContainer}>
              {event.tickets.map(ticket => (
                <View key={ticket.id} style={styles.ticketCard}>
                  <Text style={styles.ticketName}>{ticket.type}</Text>
                  <Text style={styles.ticketPrice}>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(ticket.price)}
                  </Text>
                  <Text style={styles.ticketQuantity}>
                    Disponíveis: {ticket.amount}
                  </Text>
                  <TouchableOpacity style={styles.buyButton}
                  onPress={() => openReservationModal(ticket)}>
                    <Text style={styles.buyButtonText}>Reservar</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {event.feedbacks && event.feedbacks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Avaliações</Text>
            
            <View style={styles.averageRatingContainer}>
              <Text style={styles.averageRatingText}>
                {calculateAverageRating(event.feedbacks).toFixed(1)}
              </Text>
              <View style={styles.averageRatingStars}>
                <Rating
                  type='star'
                  ratingCount={5}
                  imageSize={20}
                  readonly
                  startingValue={calculateAverageRating(event.feedbacks)}
                />
                <Text style={styles.ratingCount}>
                  ({event.feedbacks.length} avaliações)
                </Text>
              </View>
            </View>

            {event.feedbacks.map((feedback, index) => (
              <View key={index} style={styles.feedbackContainer}>
                <View style={styles.feedbackHeader}>
                  <Text style={styles.feedbackUser}>Usuário {index + 1}</Text>
                  <Rating
                    type='star'
                    ratingCount={5}
                    imageSize={16}
                    readonly
                    startingValue={feedback.rating}
                    style={styles.feedbackRating}
                  />
                </View>
                {feedback.comment && (
                  <Text style={styles.feedbackComment}>{feedback.comment}</Text>
                )}
                <Text style={styles.feedbackDate}>
                  {format(new Date(feedback.created_at), 'dd/MM/yyyy HH:mm')}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
      
      <TouchableOpacity onPress={() => setIsRatingModalVisible(true)} style={styles.fab}>
        <Text style={styles.fabText}>⭐ Avaliar</Text>
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={isRatingModalVisible}
        onRequestClose={() => setIsRatingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Avaliar Evento</Text>
            
            <Rating
              type='star'
              ratingCount={5}
              imageSize={40}
              showRating
              startingValue={0}
              onFinishRating={setRating}
              style={styles.rating}
            />
            
            <TextInput
              style={styles.commentInput}
              multiline
              numberOfLines={4}
              placeholder="Deixe seu comentário (opcional)"
              value={comment}
              onChangeText={setComment}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsRatingModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleRateEvent}
              >
                <Text style={styles.buttonText}>Enviar Avaliação</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
  animationType="slide"
  transparent={true}
  visible={isReservationModalVisible}
  onRequestClose={() => setIsReservationModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Fazer Reserva</Text>
      
      {selectedTicket && (
        <>
          <Text style={styles.ticketInfo}>Ingresso: {selectedTicket.type}</Text>
          <Text style={styles.ticketInfo}>
            Preço unitário: {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(selectedTicket.price)}
          </Text>
          <Text style={styles.ticketInfo}>
            Disponíveis: {selectedTicket.amount}
          </Text>
          
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantidade:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => setReservationQuantity(Math.max(1, reservationQuantity - 1))}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{reservationQuantity}</Text>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => setReservationQuantity(reservationQuantity + 1)}
                disabled={reservationQuantity >= selectedTicket.amount}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.totalText}>
            Total: {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(selectedTicket.price * reservationQuantity)}
          </Text>
        </>
      )}
      
      <View style={styles.modalButtons}>
        <TouchableOpacity 
          style={[styles.modalButton, styles.cancelButton]}
          onPress={() => setIsReservationModalVisible(false)}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.modalButton, styles.submitButton]}
          onPress={handleReserveTicket}
        >
          <Text style={styles.buttonText}>Confirmar Reserva</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ticketInfo: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  quantityLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#374151',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#374151',
  },
  quantityValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#111827',
    minWidth: 24,
    textAlign: 'center',
  },
  totalText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: '#6366f1',
    marginBottom: 20,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 50,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  errorText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 40,
  },
  coverImage: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: '#111827',
    marginBottom: 16,
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
  },
  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    gap: 12,
  },
  mapPlaceholderText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    maxWidth: '80%',
  },
  mapMarker: {
    position: 'absolute',
    transform: [{ translateX: -12 }, { translateY: -24 }],
  },
  ticketsContainer: {
    gap: 12,
  },
  ticketCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ticketName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  ticketPrice: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: '#6366f1',
    marginBottom: 4,
  },
  ticketQuantity: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  buyButton: {
    backgroundColor: '#6366f1',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
  },
  buyButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#ffffff',
  },
  averageRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
  },
  averageRatingText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: '#6366f1',
    marginRight: 16,
  },
  averageRatingStars: {
    flex: 1,
  },
  ratingCount: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  feedbackContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedbackUser: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#111827',
  },
  feedbackRating: {
    alignSelf: 'flex-end',
  },
  feedbackComment: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },
  feedbackDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  rating: {
    paddingVertical: 10,
  },
  commentInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginVertical: 15,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  submitButton: {
    backgroundColor: '#6366f1',
  },
  buttonText: {
    color: 'white',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#006147',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#ffffff',
  },
});