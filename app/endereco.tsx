import { Button, Card, Input } from "@rneui/themed";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
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

  const atualizarCampo = (campo: keyof Endereco, valor: string) => {
    setEndereco((prev) => ({ ...prev, [campo]: valor }));
  };
  const token = localStorage.getItem("token");
  const salvarEndereco = async () => {
    try {
      
      const response = await axios.put("http://localhost:8081/endereco/editar", endereco, {
                headers: { Authorization: `Bearer ${token}` },
              });
      Alert.alert("Sucesso", "Endereço salvo com sucesso!");
      console.log(response.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o endereço.");
      console.log(error);
    }
  };

  const excluirEndereco = async () => {
    if (!endereco) {
      return Alert.alert("Erro", "Nenhum endereço para excluir.");
    }

    try {
      await axios.delete(`${endereco}`);
      Alert.alert("Endereço excluído!");
    } catch (error) {
      Alert.alert("Erro ao excluir endereço.");
      console.log(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.push("/(tabs)/perfil")}>
  <Icon style={styles.icone} name="chevron-left" size={28} color="#000" />
</TouchableOpacity>

      <Text style={styles.titulo}>Endereço de Entrega</Text>

      <Card containerStyle={styles.card}>
        <Input
          label="Rua"
          value={endereco.rua}
          onChangeText={(t) => atualizarCampo("rua", t)}
          placeholder="Ex.: Avenida Brasil"
        />

        <Input
          label="Número"
          value={endereco.numero}
          onChangeText={(t) => atualizarCampo("numero", t)}
          placeholder="123"
          keyboardType="numeric"
        />

        <Input
          label="Bairro"
          value={endereco.bairro}
          onChangeText={(t) => atualizarCampo("bairro", t)}
          placeholder="Centro"
        />

        <Input
          label="Cidade"
          value={endereco.cidade}
          onChangeText={(t) => atualizarCampo("cidade", t)}
          placeholder="São Paulo"
        />

        <Input
          label="Estado"
          value={endereco.estado}
          onChangeText={(t) => atualizarCampo("estado", t)}
          placeholder="SP"
          maxLength={2}
        />

        <Input
          label="CEP"
          value={endereco.cep}
          onChangeText={(t) => atualizarCampo("cep", t)}
          keyboardType="numeric"
          placeholder="00000-000"
          maxLength={9}
        />

        <Button
          title="Salvar Endereço"
          onPress={salvarEndereco}
          buttonStyle={styles.botaoSalvar}
          radius={12}
        />

        <Button
          title="Excluir"
          onPress={excluirEndereco}
          buttonStyle={styles.botaoExcluir}
          radius={12}
        />
        <Button
          title="Editar"
          onPress={excluirEndereco}
          buttonStyle={styles.botaoEditar}
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
  icone:{
    color:"#cc0000ff",
     marginRight: 4,
       gap: 6,                      
  },

  titulo: {
     flexDirection: "row",        // ícone + texto lado a lado
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#4d4d4dff",
    textAlign: "center"
  },

  card: {
    borderRadius: 14,
    padding: 16,
  },

  botaoSalvar: {
    backgroundColor: "#E21E2D", // vermelho estilo iFood
    paddingVertical: 14,
    marginTop: 10,
  },

  botaoExcluir: {
    backgroundColor: "#555",
    paddingVertical: 14,
    marginTop: 10,
  },
  botaoEditar:{
    paddingVertical: 14,
    marginTop: 10,
    backgroundColor: "#00bd09ff"
    


  }
});
