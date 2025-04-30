import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Calendar, Clock, MapPin, Image as ImageIcon, Tag, Palette } from 'lucide-react-native';
import { Image } from 'react-native'; // Adicione esta linha
import { useRouter } from 'expo-router';
import api from '@/app/api/client';
import * as ImagePicker from 'expo-image-picker';
export default function CreateEventScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    color: '#f3f4f6',
    image: null as string | null,
    prices: [{ value: '', description: '' }]
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da permissão para acessar suas fotos!');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled && result.assets) {
      setFormData({ ...formData, image: result.assets[0].uri });
    }
  };

  const handlePriceChange = (index: number, field: string, value: string) => {
    const updatedPrices = [...formData.prices];
    updatedPrices[index] = { ...updatedPrices[index], [field]: value };
    setFormData({ ...formData, prices: updatedPrices });
  };
  
  const addPriceField = () => {
    setFormData({
      ...formData,
      prices: [...formData.prices, { value: '', description: '' }]
    });
  };
  
  const removePriceField = (index: number) => {
    if (formData.prices.length > 1) {
      const updatedPrices = formData.prices.filter((_, i) => i !== index);
      setFormData({ ...formData, prices: updatedPrices });
    }
  };
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const colors = [
    '#f3f4f6', '#edd4ce', '#ceedde', '#e38699', '#e386e0', '#8692e3', '#86bbe3', '#e3ab86','#d5e386', '#ebe98d', '#e86d6d', '#e8b36d'
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
    // Verificação dos campos obrigatórios
    if (!formData.name || !formData.date || !formData.time) {
      Alert.alert('Erro', 'Preencha pelo menos nome, data e hora do evento');
      return;
    }
  
    // Validação dos preços
    const invalidPrices = formData.prices.some(price => {
      return price.value && !/^\d+(\.\d{1,2})?$/.test(price.value);
    });
  
    if (invalidPrices) {
      Alert.alert('Erro', 'Formato de preço inválido. Use números com até 2 casas decimais.');
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
        status: "active",
        prices: formData.prices
          .filter(price => price.value) // Filtra preços vazios
          .map(price => ({
            value: parseFloat(price.value),
            description: price.description || 'Ingresso'
          }))
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
      <View style={styles.inputGroup}>
  <Text style={styles.label}>Imagem do Evento</Text>
  
  <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
    {formData.image ? (
      <Image source={{ uri: formData.image }} style={styles.imagePreview} />
    ) : (
      <View style={styles.imagePlaceholder}>
        <ImageIcon size={24} color="#6b7280" />
        <Text style={styles.imagePlaceholderText}>Selecione uma imagem</Text>
      </View>
    )}
  </TouchableOpacity>
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
                placeholder="2025-01-01"
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
                placeholder="10:00"
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

        <View style={styles.inputGroup}>
  <Text style={styles.label}>Preços</Text>
  
  {formData.prices.map((price, index) => (
    <View key={index} style={styles.priceRow}>
      <View style={[styles.iconInput, { flex: 1, marginRight: 8 }]}>
        <Text style={styles.currencySymbol}>R$</Text>
        <TextInput
          style={styles.priceInput}
          value={price.value}
          onChangeText={(text) => handlePriceChange(index, 'value', text)}
          placeholder="Valor"
          keyboardType="numeric"
        />
      </View>

      <View style={[styles.iconInput, { flex: 2, marginLeft: 8 }]}>
        <TextInput
          style={styles.iconInputText}
          value={price.description}
          onChangeText={(text) => handlePriceChange(index, 'description', text)}
          placeholder="Descrição (ex: Inteira, Meia)"
        />
      </View>

      {formData.prices.length > 1 && (
        <TouchableOpacity 
          style={styles.removePriceButton}
          onPress={() => removePriceField(index)}
        >
          <Text style={styles.removePriceButtonText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  ))}

  <TouchableOpacity 
    style={styles.addPriceButton}
    onPress={addPriceField}
  >
    <Text style={styles.addPriceButtonText}>+ Adicionar outro preço</Text>
  </TouchableOpacity>
</View>

        <TouchableOpacity 
          style={[styles.submitButton, { backgroundColor: '#6366f1' }, isSubmitting && styles.submitButtonDisabled]} 
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
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceInput: {
    flex: 1,
    marginLeft: 4,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
  currencySymbol: {
    fontFamily: 'Inter_500Medium',
    color: '#6b7280',
  },
  addPriceButton: {
    marginTop: 8,
    padding: 8,
    alignItems: 'center',
  },
  addPriceButtonText: {
    color: '#6366f1',
    fontFamily: 'Inter_500Medium',
  },
  removePriceButton: {
    marginLeft: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePriceButtonText: {
    color: '#ef4444',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  imagePicker: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: '#6b7280',
    fontFamily: 'Inter_400Regular',
  },
});
