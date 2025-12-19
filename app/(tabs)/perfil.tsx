import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Icon, ListItem } from "@rneui/themed";
import axios from "axios";
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { API_BASE_URL } from '../config';

type User = {
  nome: string;
  email: string;
};

export default function Perfil() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    verificarAuth();
  }, []);

  async function verificarAuth() {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        router.replace('/login');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/perfil`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser({
        nome: response.data.nome,
        email: response.data.email,
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Sessão expirada. Faça login novamente.");
      await AsyncStorage.removeItem("token");
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja sair?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("token");
              delete axios.defaults.headers.common['Authorization'];
              setUser(null);
              router.replace('/login');
            } catch {
              Alert.alert("Erro", "Não foi possível sair da conta");
            }
          }
        }
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E60014" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  const menuItems = [
    {
      icon: "person",
      title: "Dados da conta",
      subtitle: "Edite suas informações pessoais",
      route: "/dadosConta",
      color: "#E60014"
    },
    {
      icon: "location-on",
      title: "Endereços",
      subtitle: "Gerencie seus endereços de entrega",
      route: "/endereco",
      color: "#E60014"
    },
  ];

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#E60014" />
      <ScrollView style={styles.container}>
        {/* Header com gradiente visual */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {user?.nome.charAt(0).toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.name}>{user?.nome}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>

        {/* Menu de opções */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Minha Conta</Text>
          
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              onPress={() => router.push(item.route as any)}
              containerStyle={styles.listItem}
              bottomDivider
            >
              <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                <Icon 
                  name={item.icon} 
                  type="material" 
                  color={item.color} 
                  size={22} 
                />
              </View>
              <ListItem.Content>
                <ListItem.Title style={styles.listTitle}>
                  {item.title}
                </ListItem.Title>
                <ListItem.Subtitle style={styles.listSubtitle}>
                  {item.subtitle}
                </ListItem.Subtitle>
              </ListItem.Content>
              <Icon 
                name="chevron-right" 
                type="material" 
                color="#ccc" 
                size={24} 
              />
            </ListItem>
          ))}
        </View>

        {/* Botão de sair */}
        <View style={styles.logoutContainer}>
          <Button
            title="Sair da conta"
            onPress={handleLogout}
            buttonStyle={styles.logoutButton}
            titleStyle={styles.logoutTitle}
            icon={
              <Icon
                name="logout"
                type="material"
                color="#E60014"
                size={20}
                style={{ marginRight: 8 }}
              />
            }
          />
        </View>

        {/* Versão do app */}
        <Text style={styles.version}>Versão 1.0.0</Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#717171",
  },
  header: {
    backgroundColor: "#E60014",
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  headerContent: {
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 42,
    fontWeight: "700",
    color: "#E60014",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E60014",
    borderWidth: 3,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    color: "#fff",
    opacity: 0.9,
  },
  menuContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#717171",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#f5f5f5",
  },
  sectionSpacing: {
    marginTop: 16,
  },
  listItem: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  listSubtitle: {
    fontSize: 13,
    color: "#717171",
  },
  logoutContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  logoutButton: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#E60014",
    borderRadius: 12,
    paddingVertical: 14,
  },
  logoutTitle: {
    color: "#E60014",
    fontSize: 16,
    fontWeight: "700",
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: "#999",
    paddingBottom: 40,
  },
});