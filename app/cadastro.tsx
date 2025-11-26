import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
import axios from 'axios';
import { Link, useRouter } from 'expo-router';

export default function Cadastro() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const router = useRouter();

  //tem q ter @
  const validarEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Mínimo 8 caracteres, 1 maiúscula, 1 número e 1 símbolo
  const validarSenha = (senha: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return regex.test(senha);
  };
const handleCadastro = async () => {
  setErro('');
  setSucesso('');

  // remove espaços extras
  const usernameTrim = username.trim();
  const emailTrim = email.trim();

  // n pode enviar campos vazios
  if (!usernameTrim || !emailTrim || !senha || !confirmarSenha) {
    setErro('Preencha todos os campos.');
    return;
  }

  // email so com @
  if (!validarEmail(emailTrim)) {
    setErro('Insira um email válido (ex: nome@email.com).');
    return;
  }

  // campo de senha e confimar senha tem q ser iguais
  if (senha !== confirmarSenha) {
    setErro('As senhas não são iguais.');
    return;
  }

  // n pode senha fraca
  if (!validarSenha(senha)) {
    setErro('Senha fraca: mínimo 8 caracteres, 1 maiúscula, 1 número e 1 símbolo.');
    return;
  }

  setLoading(true);

  try {
    await axios.post('http://localhost:8000/auth/register', {
      username: usernameTrim,
      email: emailTrim,
      password: senha,
    });

    setSucesso('Cadastro realizado com sucesso!');

    setTimeout(() => {
      router.push('/login');
    }, 1000);

  } catch (err: any) {
    if (err.response?.status === 409) {
      setErro('Usuário ou email já existe.');
    } else {
      setErro('Erro ao cadastrar usuário. Verifique os dados.');
    }
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

      <Input
        placeholder="Confirmar senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
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
