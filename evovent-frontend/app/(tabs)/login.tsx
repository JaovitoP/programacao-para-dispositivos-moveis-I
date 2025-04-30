import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Alert, TouchableOpacity, Image, Button } from "react-native";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { API_URL, useAuth } from '@/context/AuthContext';

const Login = () => {

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
      <Button 
        onPress={login} 
        title="Sign In"
        disabled={isLoading}
      />
      <Button 
        onPress={register} 
        title="Create Account"
        disabled={isLoading}
      />
    </View>
  </View>
  )
};

const styles = StyleSheet.create({
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
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
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
  disabledButton: {
    backgroundColor: '#aaa',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
    color: '#666',
    fontSize: 14,
  },
  registerLink: {
    color: '#6C63FF',
    fontSize: 14,
  },
});

export default Login;