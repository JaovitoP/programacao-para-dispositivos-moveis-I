import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { api } from '@/app/api/client';
import { useAuth } from '@/context/AuthContext';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const { onLogin, onRegister } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const login = async () => {
    const result = await onLogin!(email, password);
    if (result && result.error){
      alert(result.msg);
    }
  }

  const register = async () => {
    const result = await onRegister!(name,email,password);
    if (result && result.error) {
      alert(result.msg);
    } else {
      login();
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>
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
        placeholder="Password" 
        secureTextEntry 
        onChangeText={setPassword} 
      />
      <TouchableOpacity 
        onPress={register} 
        style={[styles.button, styles.signInButton, isLoading && styles.disabledButton]}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.loginText}>
          Já tem uma conta? <Text style={styles.loginLink}>Faça login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
  signInButton: {
    backgroundColor: '#006147', // Verde
  },
  button: {
    height: 50,
    backgroundColor: '#006147',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC', // Cinza quando desativado
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
});

export default RegisterScreen;