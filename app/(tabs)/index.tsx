import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card, Text } from '@rneui/themed';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

type Loja = {
  idRestaurante: number;   // 🔥 CORRIGIDO
  nome: string;
  urlImagem: string;
  categoria?: any;
};

type Categoria = {
  id: number;
  nome: string;
  imagemUrl: string;
};

type RootStackParamList = {
  ProdutosRestaurante: { id: number };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Principal() {
  const navigation = useNavigation<NavigationProp>();

  const [lojas, setLojas] = useState<Loja[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Carregar lojas
  useEffect(() => {
    async function carregarLojas() {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:8081/restaurante/mobile",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const dados = Array.isArray(response.data)
          ? response.data
          : response.data.lojas || [];

        setLojas(dados);
      } catch (error) {
        console.error("Erro ao carregar lojas:", error);
      }
    }

    carregarLojas();
  }, []);

  // Carregar categorias
  useEffect(() => {
    async function carregarCategorias() {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:8081/categorias/restaurantes",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const dados = Array.isArray(response.data)
          ? response.data
          : response.data.categorias || [];

        setCategorias(dados);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    }

    carregarCategorias();
  }, []);

  return (
    <ScrollView style={{ flex: 1 }}>

      {/* PROMOÇÕES */}
      <Card>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: "center" }}
        >
          <Image
            style={{ width: 300, height: 200, marginRight: 10 }}
            resizeMode="contain"
            source={{
              uri: 'https://raw.githubusercontent.com/PatrickEN-dev/bt-food-front/main/public/promo-banner-02.png',
            }}
          />
          <Image
            style={{ width: 300, height: 200, marginRight: 10 }}
            resizeMode="contain"
            source={{
              uri: 'https://raw.githubusercontent.com/PatrickEN-dev/bt-food-front/main/public/promo-banner-02.png',
            }}
          />
        </ScrollView>
      </Card>

      {/* CATEGORIAS */}
      <Card>
        <Card.Title>Categorias</Card.Title>
        <Card.Divider />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categorias.map((c) => (
            <View key={c.id} style={styles.cardLoja}>
              <Image source={{ uri: c.imagemUrl }} style={styles.logo} resizeMode="cover" />
              <Text style={styles.nomeLoja}>{c.nome}</Text>
            </View>
          ))}
        </ScrollView>
      </Card>

      {/* LOJAS */}
      <Card>
        <Card.Title>Todas as Lojas</Card.Title>
        <Card.Divider />

        {lojas.map((l) => (
          <TouchableOpacity
            key={l.idRestaurante} // 🔥 CORRIGIDO
            style={styles.imgLoja}
            onPress={() =>
              navigation.navigate("ProdutosRestaurante", {
                id: l.idRestaurante, // 🔥 CORRIGIDO
              })
            }
          >
            <Image
              style={styles.thumb}
              resizeMode="cover"
              source={{
                uri: l.urlImagem
                  ? `http://localhost:8081${l.urlImagem.replace(/\\/g, "/")}`
                  : "https://via.placeholder.com/100"
              }}
            />
            <Text style={styles.name}>{l.nome}</Text>
          </TouchableOpacity>
        ))}

      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imgLoja: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
  },
  cardLoja: {
    alignItems: 'center',
    marginRight: 15,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  nomeLoja: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
