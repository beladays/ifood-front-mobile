import { Button, Input, Text } from '@rneui/themed';
import axios from 'axios';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { API_BASE_URL } from '../app/config';

export default function Cadastro() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [dtNascimento, setDtNascimento] = useState('');
  const [foneCelular, setFoneCelular] = useState('');

  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleCadastro = async () => {
    setErro('');
    setSucesso('');

    // 🔒 Validação de senha
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/registro`, {
        nome,
        email,
        password: senha,
        cpf,
        dt_nascimento: dtNascimento, // dd-MM-yyyy
        fone_celular: foneCelular,
        endereco: {
          rua,
          numero,
          bairro,
          cidade,
          estado,
          cep,
        },
      });

      console.log('Usuário cadastrado:', response.data);
      setSucesso('Cadastro realizado com sucesso!');

      setTimeout(() => router.push('/login'), 1000);
    } catch (err: any) {
      console.log(err.response?.data || err.message);
      setErro(err.response?.data?.message || 'Erro ao cadastrar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text h3 style={styles.title}>Criar Conta</Text>

      <Input placeholder="Nome completo" value={nome} onChangeText={setNome} />

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

      <Input
        placeholder="Confirmar senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
      />

      <Input
        placeholder="CPF"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
      />

      <Input
        placeholder="Data de nascimento (dd-MM-yyyy)"
        value={dtNascimento}
        onChangeText={setDtNascimento}
      />

      <Input
        placeholder="Celular"
        value={foneCelular}
        onChangeText={setFoneCelular}
        keyboardType="phone-pad"
      />

      <Text h4 style={styles.sectionTitle}>Endereço</Text>

      <Input placeholder="Rua" value={rua} onChangeText={setRua} />
      <Input placeholder="Número" value={numero} onChangeText={setNumero} />
      <Input placeholder="Bairro" value={bairro} onChangeText={setBairro} />
      <Input placeholder="Cidade" value={cidade} onChangeText={setCidade} />
      <Input placeholder="Estado" value={estado} onChangeText={setEstado} />
      <Input
        placeholder="CEP"
        value={cep}
        onChangeText={setCep}
        keyboardType="numeric"
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#E60014',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 10,
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
