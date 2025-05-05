import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import api from '@/app/api/client';
import { useEffect, useState } from 'react';

interface Reservation {
  id: string;
  code: string;
  status: string;
  amount: number;
  created_at: string;
}

export default function MyEvents() {
  const { authState } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      if (authState?.authenticated && authState.user?.id) {
        const reservationsResponse = await api.getReservationsByUser(authState.user.id);
        console.log('Reservations:', reservationsResponse.data);
        setReservations(reservationsResponse.data || []);
      }
    } catch (err: any) {
      setError('Falha ao carregar suas reservas');
      console.error('Error loading reservations:', err);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, [authState?.authenticated]);

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

  if (reservations.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Você não tem reservas ainda</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Minhas Reservas</Text>
      
      {reservations.map(reservation => (
        <View key={reservation.id} style={styles.reservationCard}>
          <View style={styles.reservationDetails}>
            <Text style={styles.detailLabel}>Código:</Text>
            <Text style={styles.detailValue}>{reservation.code}</Text>

            <Text style={styles.detailLabel}>Quantidade:</Text>
            <Text style={styles.detailValue}>{reservation.amount}</Text>
            
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={[
              styles.detailValue,
              reservation.status === 'active' ? styles.statusActive : styles.statusInactive
            ]}>
              {reservation.status === 'active' ? 'Ativa' : 'Inativa'}
            </Text>

            <Text style={styles.detailLabel}>Data:</Text>
            <Text style={styles.detailValue}>
              {format(new Date(reservation.created_at), 'dd/MM/yyyy HH:mm')}
            </Text>
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
  title: {
    fontSize: 24,
    color: '#111827',
    marginBottom: 20,
    fontWeight: 'bold',
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
    marginBottom: 12,
    fontWeight: '600',
  },
  statusActive: {
    color: '#10b981',
  },
  statusInactive: {
    color: '#ef4444',
  },
});