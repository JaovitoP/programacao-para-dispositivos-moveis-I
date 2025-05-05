import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Alert, TouchableOpacity, Image, Button } from "react-native";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { API_URL, useAuth } from '@/context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { onLogin, onRegister } = useAuth();

  useEffect(() => {
    const testCall = async () => {
      const result = await axios.get(`${API_URL}/users`);
      console.log("file: AuthContext.tsx:41 ~ login ~ result:", result)

    }
    testCall();
  }, [])

  const login = async () => {
    const result = await onLogin!(email, password);
    if (result && result.error){
      alert(result.msg);
    }
  }

  // We automatically call the login after a sucessful registration
  const register = async () => {
    const result = await onRegister!(email,password);
    if (result && result.error) {
      alert(result.msg);
    } else {
      login();
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
      <Image style={styles.logo} source={require('../../assets/images/icon.png')} />
      </View>
    <View style={styles.content}>
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
        onPress={login} 
        style={[styles.button, styles.signInButton, isLoading && styles.disabledButton]}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerContainer}>
        <Text style={styles.registerText}>
          Já tem uma conta? <Text style={styles.registerLink}>Faça seu cadastro</Text>
        </Text>
      </TouchableOpacity>
    </View>
  </View>
  )
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  signInButton: {
    backgroundColor: '#006147', // Verde
  },
  createAccountButton: {
    backgroundColor: '#2196F3', // Azul
  },
  disabledButton: {
    backgroundColor: '#CCCCCC', // Cinza quando desativado
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  loginButton: {
    height: 50,
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#6C63FF',
    fontSize: 14,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
  },
  registerLink: {
    color: '#006147',
  },
});

export default Login;