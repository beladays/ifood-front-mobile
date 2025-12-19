import axios from 'axios';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { API_BASE_URL } from '../app/config';

/* ================== HELPERS ================== */
const onlyNumbers = (value: string) => value.replace(/\D/g, '');

const maskCPF = (value: string) =>
  value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

const maskPhone = (value: string) =>
  value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');

const maskCEP = (value: string) =>
  value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2');

/* Digitação visual: yyyy/MM/dd */
const maskDate = (value: string) =>
  value
    .replace(/\D/g, '')
    .replace(/(\d{4})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .slice(0, 10);

/* SEMPRE envia yyyy-MM-dd */
function formatDateForBackend(data: string) {
  if (!data) return '';

  const partes = data.split('/');

  if (partes[0].length === 4) {
    const [ano, mes, dia] = partes;
    return `${ano}-${mes}-${dia}`;
  }

  const [dia, mes, ano] = partes;
  return `${ano}-${mes}-${dia}`;
}

/* ================== COMPONENT ================== */
export default function Cadastro() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [foneCelular, setFoneCelular] = useState('');
  const [dtNascimento, setDtNascimento] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');

  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');

  /* ================== VIA CEP ================== */
  async function buscarCep(valor: string) {
    setCep(maskCEP(valor));
    const cepNumeros = onlyNumbers(valor);

    if (cepNumeros.length !== 8) return;

    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${cepNumeros}/json/`
      );

      if (response.data.erro) {
        setErro('CEP não encontrado');
        return;
      }

      setRua(response.data.logradouro || '');
      setBairro(response.data.bairro || '');
      setCidade(response.data.localidade || '');
      setEstado(response.data.uf || '');
      setErro('');
    } catch {
      setErro('Erro ao buscar CEP');
    }
  }

  /* ================== CADASTRAR ================== */
  async function cadastrar() {
    const cpfNumeros = onlyNumbers(cpf);
    const foneNumeros = onlyNumbers(foneCelular);
    const cepNumeros = onlyNumbers(cep);

    if (
      !nome || !cpf || !email || !senha || !confirmarSenha ||
      !foneCelular || !dtNascimento || !rua || !numero ||
      !bairro || !cidade || !estado || !cep
    ) {
      return setErro('Preencha todos os campos');
    }

    if (!email.includes('@')) return setErro('Email inválido');
    if (cpfNumeros.length !== 11) return setErro('CPF inválido');
    if (foneNumeros.length !== 11) return setErro('Telefone inválido');
    if (cepNumeros.length !== 8) return setErro('CEP inválido');
    if (dtNascimento.length !== 10) return setErro('Data inválida');
    if (senha.length < 6) return setErro('Senha mínima de 6 caracteres');
    if (senha !== confirmarSenha) return setErro('As senhas devem ser iguais');

    const dataISO = formatDateForBackend(dtNascimento);
    console.log('DATA ENVIADA:', dataISO); // yyyy-MM-dd

    try {
      await axios.post(`${API_BASE_URL}/auth/registro`, {
        nome,
        cpf: cpfNumeros,
        email,
        password: senha,
        dt_nascimento: dataISO,
        fone_celular: foneNumeros,
        endereco: {
          rua,
          numero,
          bairro,
          cidade,
          estado,
          cep: cepNumeros,
        },
      });

      router.push('/login');
    } catch (e) {
      console.log(e);
      setErro('Erro ao cadastrar usuário');
    }
  }

  /* ================== UI ================== */
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.page}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.titulo}>Cadastro</Text>

          <Text style={styles.subtitulo}>Dados pessoais</Text>

          <View style={styles.grid}>
            <View style={[styles.group, styles.full]}>
              <Text style={styles.label}>Nome completo</Text>
              <TextInput style={styles.input} value={nome} onChangeText={setNome} />
            </View>

            <View style={styles.group}>
              <Text style={styles.label}>CPF</Text>
              <TextInput
                style={styles.input}
                value={cpf}
                onChangeText={(t) => setCpf(maskCPF(t))}
                keyboardType="numeric"
                maxLength={14}
              />
            </View>

            <View style={styles.group}>
              <Text style={styles.label}>Telefone</Text>
              <TextInput
                style={styles.input}
                value={foneCelular}
                onChangeText={(t) => setFoneCelular(maskPhone(t))}
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>

            <View style={[styles.group, styles.full]}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.group}>
              <Text style={styles.label}>Nascimento</Text>
              <TextInput
                style={styles.input}
                placeholder="yyyy/MM/dd"
                value={dtNascimento}
                onChangeText={(t) => setDtNascimento(maskDate(t))}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            <View style={[styles.group, styles.full]}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
              />
            </View>

            <View style={[styles.group, styles.full]}>
              <Text style={styles.label}>Repetir senha</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
              />
            </View>
          </View>

          <Text style={styles.subtitulo}>Endereço</Text>

          <View style={styles.grid}>
            <View style={[styles.group, styles.full]}>
              <Text style={styles.label}>Rua</Text>
              <TextInput style={styles.input} value={rua} editable={false} />
            </View>

            <View style={styles.group}>
              <Text style={styles.label}>Número</Text>
              <TextInput style={styles.input} value={numero} onChangeText={setNumero} />
            </View>

            <View style={styles.group}>
              <Text style={styles.label}>CEP</Text>
              <TextInput
                style={styles.input}
                value={cep}
                onChangeText={buscarCep}
                keyboardType="numeric"
                maxLength={9}
              />
            </View>

            <View style={[styles.group, styles.full]}>
              <Text style={styles.label}>Bairro</Text>
              <TextInput style={styles.input} value={bairro} editable={false} />
            </View>

            <View style={[styles.group, styles.full]}>
              <Text style={styles.label}>Cidade</Text>
              <TextInput style={styles.input} value={cidade} editable={false} />
            </View>

            <View style={styles.group}>
              <Text style={styles.label}>Estado</Text>
              <TextInput style={styles.input} value={estado} editable={false} />
            </View>
          </View>

          {erro ? <Text style={styles.erro}>{erro}</Text> : null}

          <TouchableOpacity style={styles.btn} onPress={cadastrar}>
            <Text style={styles.btnText}>Cadastrar</Text>
          </TouchableOpacity>

          <Text style={styles.voltar}>
            <Link href="/login">← Voltar ao login</Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ================== CSS ORIGINAL ================== */
const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#FFF5F5',
    flexGrow: 1,
    paddingBottom: 100,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    elevation: 5,
  },
  titulo: {
    textAlign: 'center',
    color: '#EA1D2C',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
    color: '#222',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  group: {
    width: '48%',
    marginBottom: 16,
  },
  full: {
    width: '100%',
  },
  label: {
    marginBottom: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  erro: {
    backgroundColor: '#FFEAEA',
    color: '#B30000',
    textAlign: 'center',
    padding: 14,
    borderRadius: 12,
    marginVertical: 16,
    fontSize: 14,
  },
  btn: {
    backgroundColor: '#EA1D2C',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  btnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  voltar: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  },
});
