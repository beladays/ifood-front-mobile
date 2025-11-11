import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
import axios from 'axios';
import { useLocalSearchParams, Link } from 'expo-router';

export default function RedefinirSenha() {
  const { token } = useLocalSearchParams(); // pega o token da URL
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRedefinir = async () => {
    setErro('');
    setMensagem('');

    if (!novaSenha || novaSenha.length < 6) {
      return setErro('A senha deve ter pelo menos 6 caracteres.');
    }

    if (novaSenha !== confirmarSenha) {
      return setErro('As senhas não coincidem.');
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/auth/redefinirsenha', {
        token,
        novaSenha,
      });

      setMensagem(response.data.message || 'Senha redefinida com sucesso!');
    } catch (err: any) {
      console.log(err.response?.data || err.message);
      setErro(err.response?.data?.message || 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>Redefinir Senha</Text>

      <Input
        placeholder="Nova senha"
        value={novaSenha}
        onChangeText={setNovaSenha}
        secureTextEntry
      />

      <Input
        placeholder="Confirmar nova senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
      />

      {erro ? <Text style={styles.error}>{erro}</Text> : null}
      {mensagem ? <Text style={styles.success}>{mensagem}</Text> : null}

      <Button
        title="Salvar nova senha"
        loading={loading}
        buttonStyle={styles.button}
        onPress={handleRedefinir}
      />

      <View style={styles.linksContainer}>
        <Link href="/login" style={styles.link}>
          Voltar para o login
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { textAlign: 'center', marginBottom: 32 },
  button: { backgroundColor: '#E60014', borderRadius: 8, paddingVertical: 12 },
  error: { color: 'red', textAlign: 'center', marginBottom: 10 },
  success: { color: 'green', textAlign: 'center', marginBottom: 10 },
  linksContainer: { alignItems: 'center', marginTop: 20 },
  link: { color: '#E60014', fontWeight: 'bold' },
});
