import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import api from '@/app/api/client';
import { useEffect, useState } from 'react';
import QRCode from 'react-native-qrcode-svg';
import { Reservation } from '@/app/types/reservation';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function Participants() {
  const { authState } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const route = useRoute();
  const { eventId } = route.params as { eventId: string };
  const [validating, setValidating] = useState<string | null>(null);

  const validateReservation = async (reservationId: string) => {
    try {
      setValidating(reservationId);
      
      const response = await api.validateTicket(reservationId);
      if (response.status === 200) {
        setReservations(prev => prev.map(res => 
          res.id === reservationId ? { ...res, status: 'validated' } : res
        ));
        setFilteredReservations(prev => prev.map(res => 
          res.id === reservationId ? { ...res, status: 'validated' } : res
        ));
        
        Alert.alert('Sucesso', 'Ingresso validado com sucesso!');
      } else {
        throw new Error('Falha na validação');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível validar o ingresso');
      console.error('Validation error:', error);
    } finally {
      setValidating(null);
    }
  };

  const loadParticipants = async () => {
    try {
      setLoading(true);
      setError(null);
      if (authState?.authenticated && authState.user?.id) {
        const participantsResponse = await api.getReservationsByEventId(eventId);
        setReservations(participantsResponse.data || []);
        setFilteredReservations(participantsResponse.data || []);
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setReservations([]);
        setFilteredReservations([]);
      } else {
        setError('Falha ao carregar seus participantes');
        setReservations([]);
        setFilteredReservations([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParticipants();
  }, [authState?.authenticated]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = reservations.filter(reservation => 
        reservation.user.cpf?.includes(searchTerm)
      );
      setFilteredReservations(filtered);
    } else {
      setFilteredReservations(reservations);
    }
  }, [searchTerm, reservations]);

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
        <TouchableOpacity onPress={loadParticipants} style={styles.reloadButton}>
          <Ionicons name="reload" size={20} color="#6366f1" />
          <Text style={styles.reloadText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (reservations.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="people-outline" size={64} color="#d1d5db" />
        <Text style={styles.emptyText}>Você não possui participantes ainda</Text>
      </View>
    );
  }

  const totalParticipants = filteredReservations.reduce((sum, reservation) => sum + reservation.amount, 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por CPF"
          value={searchTerm}
          onChangeText={setSearchTerm}
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.headerText}>Total de Participantes: {totalParticipants}</Text>
      
      {filteredReservations.map((reservation) => (
        <View key={reservation.id} style={styles.reservationCard}>
              <View style={styles.codeContainer}>
      <View style={styles.qrCodeWrapper}>
        <QRCode 
          value={reservation.code} 
          size={60} 
          color="black" 
          backgroundColor="white" 
        />
      </View>
      <View style={styles.codeTextContainer}>
        <Text style={styles.codeLabel}>Código do Ingresso</Text>
        <Text style={styles.codeValue}>{reservation.code}</Text>
      </View>
    </View>
          <View style={styles.row}>
            {/* Coluna 1 */}
            <View style={styles.column}>
              <Text style={styles.detailLabel}>Nome</Text>
              <Text style={styles.detailValue}>{reservation.user.name}</Text>
            </View>
            
            {/* Coluna 2 */}
            <View style={styles.column}>
              <Text style={styles.detailLabel}>CPF</Text>
              <Text style={styles.detailValue}>
                {reservation.user.cpf || 'Não informado'}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.detailLabel}>E-mail</Text>
              <Text style={styles.detailValue}>{reservation.user.email}</Text>
            </View>
            
            <View style={styles.column}>
              <Text style={styles.detailLabel}>Quantidade</Text>
              <Text style={styles.detailValue}>{reservation.amount}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.detailLabel}>Data</Text>
              <Text style={styles.detailValue}>
                {format(new Date(reservation.created_at), 'dd/MM/yyyy HH:mm')}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.detailLabel}>Status</Text>
        <Text style={[
          styles.detailValue,
          reservation.status === 'validated' ? styles.statusActive : styles.statusInactive
        ]}>
          {reservation.status === 'validated' ? 'Validado' : 'Pendente'}
        </Text>
      </View>
      
        </View>
      <View style={styles.column}>
        {reservation.status !== 'validated' && (
          <TouchableOpacity 
            style={styles.validateButton}
            onPress={() => validateReservation(reservation.id)}
            disabled={validating === reservation.id}
          >
            {validating === reservation.id ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.validateButtonText}>Validar Ingresso</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  qrCodeWrapper: {
    marginRight: 12,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  codeTextContainer: {
    flex: 1,
  },
  codeLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  codeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  validateButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  validateButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#374151',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  column: {
    flex: 1,
    paddingRight: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
    color: '#9ca3af',
    marginTop: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  reservationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  headerText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
    padding: 5,
  },
  reservationDetails: {
    gap: 4,
  },
  detailLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 10,
    fontWeight: '600',
  },
  statusActive: {
    color: '#10b981',
  },
  statusInactive: {
    color: '#ef4444',
  },
  qrCodeContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  reloadButton: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reloadText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '500',
  },
});
