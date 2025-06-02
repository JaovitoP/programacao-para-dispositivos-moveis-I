import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import api from '@/app/api/client';
import { useEffect, useState } from 'react';
import QRCode from 'react-native-qrcode-svg';

interface Reservation {
  id: string;
  code: string;
  status: string;
  amount: number;
  created_at: string;
}

export default function MyReservations() {
  const { authState } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      if (authState?.authenticated && authState.user?.id) {
        const reservationsResponse = await api.getReservationsByUser(authState.user.id);
        setReservations(reservationsResponse.data || []);
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setReservations([]);
      } else {
        setError('Falha ao carregar suas reservas');
        console.error('Error loading reservations:', err);
        setReservations([]);
      }
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
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Ingressos</Text>
      
      {reservations.map(reservation => (
        <View key={reservation.id} style={styles.reservationCard}>
          <View style={styles.reservationContent}>
            <View style={styles.reservationDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Código:</Text>
                <Text style={styles.detailValue}>{reservation.code}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Quantidade:</Text>
                <Text style={styles.detailValue}>{reservation.amount}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={[
                  styles.detailValue,
                  reservation.status === 'validated' ? styles.statusValidated :
                  reservation.status === 'active' ? styles.statusActive : 
                  styles.statusInactive
                ]}>
                  {reservation.status === 'validated' ? 'Validado' :
                  reservation.status === 'active' ? 'Ativo' : 
                  reservation.status === 'pending' ? 'Pendente' : 'Inativo'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Data:</Text>
                <Text style={styles.detailValue}>
                  {format(new Date(reservation.created_at), 'dd/MM/yyyy HH:mm')}
                </Text>
              </View>
            </View>

            <View style={styles.qrCodeContainer}>
              <QRCode 
                value={reservation.code} 
                size={80} 
                backgroundColor="transparent"
                color="#111827"
              />
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
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    fontFamily: 'Inter-Medium',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 40,
    fontFamily: 'Inter-Medium',
  },
  title: {
    fontSize: 22,
    color: '#0f172a',
    marginBottom: 24,
    fontFamily: 'Inter-Bold',
    paddingTop: 16,
  },
  reservationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  reservationContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reservationDetails: {
    flex: 1,
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
  },
  detailValue: {
    fontSize: 14,
    color: '#0f172a',
    fontFamily: 'Inter-Medium',
  },
  statusActive: {
    color: '#2563eb',
  },
  statusValidated: {
    color: '#16a34a',
  },
  statusInactive: {
    color: '#dc2626',
  },
  qrCodeContainer: {
    marginLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
});