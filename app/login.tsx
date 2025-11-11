import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setErro('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/auth/login', {
        email,
        password: senha,
      });

      const token = response.data.token;
     // console.log('Token JWT:', token);
     console.log('Usuário logado');

      // Salvar o token no AsyncStorage
      await AsyncStorage.setItem('token', token);

      // Navegar pra próxima tela 
      router.push('/');

    } catch (err: any) {
      console.log(err.response?.data || err.message);
      setErro(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>Entrar</Text>

      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Input
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      {erro ? <Text style={styles.error}>{erro}</Text> : null}

      <Button
        title="Login"
        loading={loading}
        buttonStyle={styles.button}
        onPress={handleLogin}
      />

      <Text style={styles.linkText}>
        Ainda não tem conta?{' '}
        <Link href="/cadastro" style={styles.link}>
          Cadastre-se
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { textAlign: 'center', marginBottom: 32 },
  button: { backgroundColor: '#E60014', borderRadius: 8, paddingVertical: 12 },
  linkText: { textAlign: 'center', marginTop: 16 },
  link: { color: '#E60014', fontWeight: 'bold' },
  error: { color: 'red', textAlign: 'center', marginBottom: 10 },
});
