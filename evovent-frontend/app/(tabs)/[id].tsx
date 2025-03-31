import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity, Share } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { format } from 'date-fns';
import { MapPin, Clock, Users, Share2 } from 'lucide-react-native';
import api from '@/app/api/client';
import { useEffect, useState } from 'react';
import * as Sharing from 'expo-sharing';

interface EventDetails {
  category: string;
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  image?: string;
  attendees?: number;
  color?: string;
}

const MapMarker = () => (
  <View style={styles.mapMarker}>
    <MapPin size={24} color="#6366f1" />
  </View>
);

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleShare = async () => {
    try {
      const result = await Share.share({
        title: event?.name || 'Evento',
        message: `Confira o evento: ${event?.name || 'Evento'}
        \nData: ${event ? format(new Date(event.date), 'EEEE, MMMM d, yyyy h:mm a') : 'Data indisponível'}
        \nLocal: ${event?.location || 'Local indisponível'}
        \nDescrição: ${event?.description || 'Descrição indisponível'}`,
        url: event?.image || '',
      }, {
        dialogTitle: 'Compartilhar evento',
        subject: `Detalhes do evento: ${event?.name || 'Evento'}`, // Para email
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

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        const response = await api.getEventById(id as string);
        console.log(response.data);
        setEvent(response.data);
      } catch (err) {
        setError('Failed to load event details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

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
    <ScrollView  style={[styles.container, { backgroundColor: event.color || '#f3f4f6' }]} >
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

        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.mapContainer}>
            <View style={styles.mapPlaceholder}>
              <MapPin size={32} color="#6366f1" />
              <Text style={styles.mapPlaceholderText}>
                Map integration requires a Google Maps API key
              </Text>
            </View>
          </View>
        </View> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    color: '#374151',
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
});