import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Button, Card } from "@rneui/themed";
import axios from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function DadosConta() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔹 Buscar dados do usuário
  useEffect(() => {
    async function carregarDados() {
      try {
        const token = await AsyncStorage.getItem("token"); // 🔑 Recupera o token salvo

        const response = await axios.get("http://localhost:8000/perfil/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setNome(response.data.nome);
        setEmail(response.data.email);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados da conta.");
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  //  Atualizar dados do usuário
  const handleUpdate = async () => {
    try {
      const token = ""; // 
      await axios.patch(
        "http://localhost:8000/perfil",
        { nome, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
      router.back(); 
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      Alert.alert("Erro", "Não foi possível atualizar os dados.");
    }
  };

  // 🔹 Excluir conta
  const handleDeleteAccount = () => {
    Alert.alert(
      "Excluir conta",
      "Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const token = "";
              await axios.delete("http://localhost:8000/perfil", {
                headers: { Authorization: `Bearer ${token}` },
              });

              Alert.alert("Conta excluída com sucesso!");
              router.replace("/login");
            } catch (error) {
              console.error("Erro ao excluir conta:", error);
              Alert.alert("Erro", "Não foi possível excluir a conta.");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.card}>
        <Card.Title>Editar Dados da Conta</Card.Title>
        <Card.Divider />

        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
        />

        <Button
          title="Salvar Alterações"
          onPress={handleUpdate}
          buttonStyle={{ backgroundColor: "#2196F3", borderRadius: 8 }}
          containerStyle={{ marginTop: 15 }}
        />

        <Button
          title="Excluir Conta"
          onPress={handleDeleteAccount}
          buttonStyle={{ backgroundColor: "#D32F2F", borderRadius: 8 }}
          containerStyle={{ marginTop: 10 }}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  card: { borderRadius: 10, elevation: 3 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
