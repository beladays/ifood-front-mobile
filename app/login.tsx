import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Icon, Input, Text } from '@rneui/themed';
import axios from 'axios';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { API_BASE_URL } from '../app/config';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const router = useRouter();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();

  const handleLogin = async () => {
    setErro('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password: senha,
      });

      const token = response.data.token;
      console.log('Token JWT:', token);

      await AsyncStorage.setItem('token', token);

      const target =
        typeof redirect === "string"
          ? redirect
          : Array.isArray(redirect)
          ? redirect[0]
          : "/";

      router.replace(target);

    } catch (err: any) {
      console.log(err.response?.data || err.message);
      setErro(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Header com logo/título */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Icon
                name="restaurant"
                type="material"
                color="#E60014"
                size={60}
              />
            </View>
            <Text h2 style={styles.title}>Bem-vindo!</Text>
            <Text style={styles.subtitle}>Entre com sua conta para continuar</Text>
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              leftIcon={
                <Icon
                  name="email"
                  type="material"
                  size={20}
                  color="#999"
                />
              }
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.input}
              containerStyle={styles.inputWrapper}
            />

            <Input
              placeholder="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!mostrarSenha}
              leftIcon={
                <Icon
                  name="lock"
                  type="material"
                  size={20}
                  color="#999"
                />
              }
              rightIcon={
                <Icon
                  name={mostrarSenha ? "visibility" : "visibility-off"}
                  type="material"
                  size={20}
                  color="#999"
                  onPress={() => setMostrarSenha(!mostrarSenha)}
                />
              }
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.input}
              containerStyle={styles.inputWrapper}
            />

            <Link href="/esqueceuSenha" asChild>
              <Text style={styles.linkSenha}>
                Esqueceu sua senha?
              </Text>
            </Link>

            {erro ? (
              <View style={styles.errorContainer}>
                <Icon
                  name="error-outline"
                  type="material"
                  size={18}
                  color="#E60014"
                />
                <Text style={styles.error}>{erro}</Text>
              </View>
            ) : null}

            <Button
              title="Entrar"
              loading={loading}
              buttonStyle={styles.button}
              containerStyle={styles.buttonContainer}
              titleStyle={styles.buttonTitle}
              onPress={handleLogin}
              disabled={!email || !senha}
              disabledStyle={styles.buttonDisabled}
            />
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.divider} />
          </View>

          {/* Cadastro */}
          <View style={styles.cadastroContainer}>
            <Text style={styles.cadastroText}>
              Ainda não tem conta?{' '}
            </Text>
            <Link href="/cadastro" asChild>
              <Text style={styles.cadastroLink}>
                Cadastre-se grátis
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 15,
    color: '#717171',
  },
  form: {
    marginBottom: 32,
  },
  inputWrapper: {
    paddingHorizontal: 0,
    marginBottom: 16,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: '#fafafa',
  },
  input: {
    fontSize: 15,
    marginLeft: 10,
    color: '#1a1a1a',
  },
  linkSenha: {
    color: '#E60014',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'right',
    marginTop: -8,
    marginBottom: 24,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  error: {
    color: '#E60014',
    fontSize: 13,
    flex: 1,
  },
  buttonContainer: {
    marginTop: 8,
  },
  button: {
    backgroundColor: '#E60014',
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#E60014',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#ffcccc',
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  cadastroContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  cadastroText: {
    fontSize: 15,
    color: '#717171',
  },
  cadastroLink: {
    fontSize: 15,
    color: '#E60014',
    fontWeight: '700',
  },
});