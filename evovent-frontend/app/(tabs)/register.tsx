import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import { mask as masker, unMask } from 'react-native-mask-text';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { onLogin, onRegister } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  
  const [instagram_url, setInstagram_url] = useState("");
  const [facebook_url, setFacebook_url] = useState("");
  const [linkedin_url, setLinkedin_url] = useState("");
  const [about, setAbout] = useState("");

  const login = async () => {
    const result = await onLogin!(email, password);
    if (result && result.error){
      alert(result.msg);
    }
  };

  const register = async () => {
    setIsLoading(true);
    const result = await onRegister!(name, email, password, instagram_url, facebook_url, linkedin_url, about, cpf);
    setIsLoading(false);
    if (result && result.error) {
      alert('Há algo de errado, verifique os dados e tente novamente.');
    } else {
      login();
    }
  };
    const handleChangeCpf = (text) => {
    const maskedText = masker(text, '999.999.999-99');
    setCpf(maskedText);
  };


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Criar conta</Text>
        
        <Text style={styles.socialToggleText}>Dados Pessoais</Text>
        <TextInput 
          style={styles.input}
          placeholder="CPF"
          onChangeText={handleChangeCpf}
          value={cpf}
          keyboardType="numeric"
          maxLength={14}
        />

        <TextInput 
          style={styles.input}
          placeholder="Nome" 
          onChangeText={setName} 
        />
        <TextInput 
          style={styles.input}
          placeholder="Email" 
          onChangeText={setEmail} 
        />
        <TextInput 
          style={styles.input}
          placeholder="Senha" 
          secureTextEntry 
          onChangeText={setPassword} 
        />
        <TextInput 
          style={styles.input}
          placeholder="Sobre Mim" 
          onChangeText={setAbout} 
        />

        <TouchableOpacity 
          style={styles.socialToggle}
          onPress={() => setShowSocials(!showSocials)}
        >
          <Text style={styles.socialToggleText}>Redes Sociais</Text>
        </TouchableOpacity>

          <View style={styles.socialInputs}>
            <View style={styles.inputWithIcon}>
              <FontAwesome name="instagram" size={20} color="#C13584" style={styles.icon} />
              <TextInput 
                style={styles.inputFlex}
                placeholder="Instagram" 
                onChangeText={setInstagram_url} 
                value={instagram_url}
              />
            </View>
            <View style={styles.inputWithIcon}>
              <FontAwesome name="facebook" size={20} color="#3b5998" style={styles.icon} />
              <TextInput 
                style={styles.inputFlex}
                placeholder="Facebook" 
                onChangeText={setFacebook_url} 
                value={facebook_url}
              />
            </View>
            <View style={styles.inputWithIcon}>
              <FontAwesome name="linkedin" size={20} color="#0077B5" style={styles.icon} />
              <TextInput 
                style={styles.inputFlex}
                placeholder="LinkedIn" 
                onChangeText={setLinkedin_url} 
                value={linkedin_url}
              />
            </View>
          </View>

        <TouchableOpacity 
          onPress={register} 
          style={[styles.button, styles.signInButton, isLoading && styles.disabledButton]}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>
            Já tem uma conta? <Text style={styles.loginLink}>Faça login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    height: 50,
  },
  inputFlex: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  icon: {
    width: 24,
  },
  signInButton: {
    backgroundColor: '#006147', 
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC', 
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loginText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
  },
  loginLink: {
    color: '#006147',
    fontWeight: 'bold',
  },
  socialToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  socialToggleText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  socialInputs: {
    marginBottom: 15,
  }
});

export default RegisterScreen;
