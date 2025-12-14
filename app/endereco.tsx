import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Button, Card, Icon, ListItem } from "@rneui/themed";
import axios from "axios";
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { API_BASE_URL } from "../app/config";

export default function Perfil() {
  const [user, setUser] = useState<{ nome: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const token = await AsyncStorage.getItem("token"); 
        if (!token) {
          Alert.alert("Erro", "Usuário não autenticado.");
          router.replace('/login');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/perfil`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser({ nome: response.data.nome, email: response.data.email });
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        Alert.alert("Erro", "Não foi possível carregar o perfil.");
      } finally {
        setLoading(false);
      }
    }

    carregarPerfil();
  }, []);

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#E91E63" />
      <Text>Carregando perfil...</Text>
    </View>
  );

  if (!user) return (
    <View style={styles.center}>
      <Text>Erro ao carregar dados do usuário</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.card}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user.nome[0]?.toUpperCase()}</Text>
          </View>
          <Avatar size={100} rounded containerStyle={{ marginBottom: 15 }} />
          <Text style={styles.name}>{user.nome}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </Card>

      <ListItem onPress={() => router.push('/endereco')}>
        <Icon name="location-on" type="material" color="#E91E63" size={28} />
        <ListItem.Content>
          <ListItem.Title>Endereço</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>

      <ListItem onPress={() => router.push('/dadosConta')}>
        <Icon name="settings" type="material" color="#1f1f1f" size={28} />
        <ListItem.Content>
          <ListItem.Title>Dados da conta</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>

      <Button
        title="Sair"
        onPress={async () => {
          await AsyncStorage.removeItem("token");
          router.replace('/login');
        }}
        buttonStyle={{ backgroundColor: "#E91E63", borderRadius: 8, width: 200 }}
        containerStyle={{ marginTop: 20, alignItems: "center" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { borderRadius: 10, padding: 20, shadowOpacity: 0.1, elevation: 5 },
  avatarContainer: { alignItems: "center" },
  name: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  email: { fontSize: 16, color: "#555", marginTop: 4 },
  avatarText: { fontSize: 36, fontWeight: "bold", color: "#d32f2f" },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#fde4e4", alignItems: "center", justifyContent: "center", marginBottom: 15 },
});
