import { Avatar, Button, Card, Icon, ListItem } from "@rneui/themed";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";


export default function Perfil() {
  const [user, setUser] = useState<{ nome: string; email: string;  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarPerfil() {
      try {
  
       const token = "seu_token_aqui";
         const response = await axios.get("http://localhost:8000/perfil/2", {
          headers: { Authorization: `Bearer ${token}` },
        });
         const data = response.data;

         console.log(data)





        // Define o usuário com base nos dados da API
        setUser({
          nome: `${data.nome}`,
          email: data.email
          
        });
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        Alert.alert("Erro", "Não foi possível carregar o perfil.");
      } finally {
        setLoading(false);
      }
    }

    carregarPerfil();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E91E63" />
        <Text>Carregando perfil...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Erro ao carregar dados do usuário </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.card}>
        <View style={styles.avatarContainer}>
          <Avatar
            size={100}
            rounded
            
            containerStyle={{ marginBottom: 15 }}
          />
          <Text style={styles.name}>{user.nome}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <Button
          title="Sair"
          onPress={() => Alert.alert("Logout realizado!")}
          buttonStyle={{ backgroundColor: "#E91E63", borderRadius: 8 }}
          containerStyle={{ marginTop: 20 }}
        />
      </Card>

      <>
        <ListItem>
          <Icon name="location-on"
            type="material"
            color="#E91E63"
            size={28}
          />

          <ListItem.Content>
            <ListItem.Title>Endereço</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <ListItem>
          <Icon name="trash-can-outline" type="material-community" color="grey" />
          <ListItem.Content>
            <ListItem.Title>Trash</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: "#f82727ff",
  },
  card: {
    borderRadius: 10,
    padding: 20,
    shadowOpacity: 0.1,
    elevation: 5,
  },
  avatarContainer: { alignItems: "center" },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
  },
});
