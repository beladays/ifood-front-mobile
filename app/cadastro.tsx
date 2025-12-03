import { Button, Input, Text } from '@rneui/themed';
import axios from 'axios';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function Cadastro() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const router = useRouter();

  const handleCadastro = async () => {
    setErro('');
    setSucesso('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8081/auth/registro', {
        username,
        email,
        password: senha,
      });

      console.log('Usuário cadastrado:', response.data);

      setSucesso('Cadastro realizado com sucesso!');
      
      // Opcional: aguarda 1s e redireciona pro login
      setTimeout(() => {
        router.push('/login');
      }, 1000);

    } catch (err: any) {
      console.log(err.response?.data || err.message);
      setErro(err.response?.data?.message || 'Erro ao cadastrar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>Criar Conta</Text>

      <Input
        placeholder="Nome de usuário"
        value={username}
        onChangeText={setUsername}
      />

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
      {sucesso ? <Text style={styles.success}>{sucesso}</Text> : null}

      <Button
        title="Cadastrar"
        loading={loading}
        buttonStyle={styles.button}
        onPress={handleCadastro}
      />

      <View style={styles.linksContainer}>
        <Text style={styles.linkText}>
          Já tem uma conta?{' '}
          <Link href="/login" style={styles.link}>
            Fazer login
          </Link>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#E60014',
    borderRadius: 8,
    paddingVertical: 12,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  success: {
    color: 'green',
    textAlign: 'center',
    marginBottom: 10,
  },
  linksContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  linkText: {
    textAlign: 'center',
  },
  link: {
    color: '#E60014',
    fontWeight: 'bold',
  },
});
