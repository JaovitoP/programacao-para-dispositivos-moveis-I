import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Calendar, Clock, MapPin, Image as ImageIcon, Tag, Palette } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import api from '@/app/api/client';

export default function CreateEventScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',       // AAAA-MM-DD
    time: '',       // HH:MM
    location: '',
    category: '',
    color: '#f3f4f6', // Cor padrão
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const colors = [
    '#edd4ce', '#ceedde', '#e38699', '#e386e0', '#8692e3', '#86bbe3', '#e3ab86','#d5e386', '#ebe98d', '#e86d6d', '#e8b36d'
  ];
  const handleColorSelect = (color: string) => {
    setFormData({ ...formData, color });
  };

  const validateDateTime = (date: string, time: string): boolean => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^\d{2}:\d{2}$/;
    
    return dateRegex.test(date) && timeRegex.test(time);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.date || !formData.time) {
      Alert.alert('Erro', 'Preencha pelo menos nome, data e hora do evento');
      return;
    }

    if (!validateDateTime(formData.date, formData.time)) {
      Alert.alert('Erro', 'Formato inválido para data (AAAA-MM-DD) ou hora (HH:MM)');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const eventData = {
        name: formData.name,
        description: formData.description || null,
        date: `${formData.date}`,
        time: `${formData.time}`,
        location: formData.location || null,
        category: formData.category || null,
        color: formData.color,
        status: "active"
      };

      console.log(eventData);
      const response = await api.createEvent(eventData);
      
      if (response.status === 201) {
        Alert.alert('Sucesso', 'Evento criado com sucesso!');
        router.back();
      }
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      Alert.alert('Erro', 'Não foi possível criar o evento');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Criar Evento</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome do Evento*</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Nome obrigatório"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Data*</Text>
            <View style={styles.iconInput}>
              <Calendar size={20} color="#6b7280" />
              <TextInput
                style={styles.iconInputText}
                value={formData.date}
                onChangeText={(text) => setFormData({ ...formData, date: text })}
                placeholder="AAAA-MM-DD"
              />
            </View>
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Hora*</Text>
            <View style={styles.iconInput}>
              <Clock size={20} color="#6b7280" />
              <TextInput
                style={styles.iconInputText}
                value={formData.time}
                onChangeText={(text) => setFormData({ ...formData, time: text })}
                placeholder="HH:MM"
              />
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Localização</Text>
          <View style={styles.iconInput}>
            <MapPin size={20} color="#6b7280" />
            <TextInput
              style={styles.iconInputText}
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
              placeholder="Onde será o evento?"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Categoria</Text>
          <View style={styles.iconInput}>
            <Tag size={20} color="#6b7280" />
            <TextInput
              style={styles.iconInputText}
              value={formData.category}
              onChangeText={(text) => setFormData({ ...formData, category: text })}
              placeholder="Ex: Música, Esporte, etc."
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cor do Evento</Text>
          <View style={styles.iconInput}>
            <Palette size={20} color="#6b7280" />
            <TextInput
              style={styles.iconInputText}
              value={formData.color}
              onChangeText={(text) => setFormData({ ...formData, color: text })}
              placeholder="Código hexadecimal (#RRGGBB)"
            />
          </View>

          {/* Lista de cores */}
          <View style={styles.colorOptions}>
            {colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.colorButton, { backgroundColor: color }]}
                onPress={() => handleColorSelect(color)}
              />
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Detalhes sobre o evento..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, { backgroundColor: formData.color }, isSubmitting && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Criando...' : 'Criar Evento'}
          </Text>
        </TouchableOpacity>
      </View>
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
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
  iconInput: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconInputText: {
    flex: 1,
    marginLeft: 8,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  submitButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#ffffff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },

  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 8,
    marginBottom: 8,
  },
});
