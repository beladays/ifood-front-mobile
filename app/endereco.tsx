import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Card, Input } from "@rneui/themed";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export type Endereco = {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
};

export default function EnderecoScreen() {
  const router = useRouter();

  const [endereco, setEndereco] = useState<Endereco>({
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  });

  const [loading, setLoading] = useState(true);
  const [editavel, setEditavel] = useState(false);

  const atualizarCampo = (campo: keyof Endereco, valor: string) => {
    setEndereco((prev) => ({ ...prev, [campo]: valor }));
  };

  // 🔥 BUSCA SOMENTE DO BACKEND
  const carregarEndereco = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro", "Usuário não autenticado");
        return;
      }

      const response = await axios.get(
        "http://localhost:8081/endereco/pegar-endereco",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEndereco(response.data);
      setEditavel(false);
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      Alert.alert("Erro", "Não foi possível carregar o endereço.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEndereco();
  }, []);

  const salvarEndereco = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      await axios.put(
        "http://localhost:8081/endereco/editar",
        endereco,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Sucesso", "Endereço salvo com sucesso!");
      setEditavel(false);
      carregarEndereco(); // recarrega do backend
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar o endereço.");
    }
  };

  const excluirEndereco = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      await axios.delete(
        "http://localhost:8081/endereco/excluir",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Sucesso", "Endereço excluído!");
      setEndereco({
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
      });
      setEditavel(true);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível excluir o endereço.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E21E2D" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.push("/(tabs)/perfil")}>
        <Icon style={styles.icone} name="chevron-left" size={28} />
      </TouchableOpacity>

      <Text style={styles.titulo}>Endereço de Entrega</Text>

      <Card containerStyle={styles.card}>
        {editavel ? (
          <>
            <Input label="Rua" value={endereco.rua} onChangeText={(t) => atualizarCampo("rua", t)} />
            <Input label="Número" value={endereco.numero} onChangeText={(t) => atualizarCampo("numero", t)} keyboardType="numeric" />
            <Input label="Bairro" value={endereco.bairro} onChangeText={(t) => atualizarCampo("bairro", t)} />
            <Input label="Cidade" value={endereco.cidade} onChangeText={(t) => atualizarCampo("cidade", t)} />
            <Input label="Estado" value={endereco.estado} onChangeText={(t) => atualizarCampo("estado", t)} maxLength={2} />
            <Input label="CEP" value={endereco.cep} onChangeText={(t) => atualizarCampo("cep", t)} keyboardType="numeric" maxLength={9} />
          </>
        ) : (
          <View style={styles.visualizacao}>
            <Text style={styles.label}>Rua:</Text>
            <Text style={styles.textoEndereco}>{endereco.rua}</Text>

            <Text style={styles.label}>Número:</Text>
            <Text style={styles.textoEndereco}>{endereco.numero}</Text>

            <Text style={styles.label}>Bairro:</Text>
            <Text style={styles.textoEndereco}>{endereco.bairro}</Text>

            <Text style={styles.label}>Cidade:</Text>
            <Text style={styles.textoEndereco}>{endereco.cidade}</Text>

            <Text style={styles.label}>Estado:</Text>
            <Text style={styles.textoEndereco}>{endereco.estado}</Text>

            <Text style={styles.label}>CEP:</Text>
            <Text style={styles.textoEndereco}>{endereco.cep}</Text>
          </View>
        )}

        <Button
          title={editavel ? "Salvar Endereço" : "Editar Endereço"}
          onPress={editavel ? salvarEndereco : () => setEditavel(true)}
          buttonStyle={styles.botaoSalvar}
          radius={12}
        />

        <Button
          title="Excluir Endereço"
          onPress={excluirEndereco}
          buttonStyle={styles.botaoExcluir}
          radius={12}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  icone: {
    color: "#cc0000ff",
    marginRight: 4,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#4d4d4dff",
    textAlign: "center",
  },
  card: {
    borderRadius: 14,
    padding: 16,
  },
  visualizacao: {
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#555",
    marginTop: 8,
  },
  textoEndereco: {
    fontSize: 16,
    marginBottom: 4,
    color: "#333",
  },
  botaoSalvar: {
    backgroundColor: "rgba(253, 207, 4, 1)",
    paddingVertical: 14,
    marginTop: 10,
  },
  botaoExcluir: {
    backgroundColor: "#fd0b0bff",
    paddingVertical: 14,
    marginTop: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
