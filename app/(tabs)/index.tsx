import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text } from '@rneui/themed';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

type Loja = {
  idRestaurante: number;
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
    <ScrollView style={styles.container}>

      {/* PROMOÇÕES */}
      <View style={styles.promoSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.promoScroll}
        >
          <View style={styles.promoCard}>
            <Image
              style={styles.promoImage}
              resizeMode="cover"
              source={{
                uri: 'https://raw.githubusercontent.com/PatrickEN-dev/bt-food-front/main/public/promo-banner-02.png',
              }}
            />
          </View>
          <View style={styles.promoCard}>
            <Image
              style={styles.promoImage}
              resizeMode="cover"
              source={{
                uri: 'https://raw.githubusercontent.com/PatrickEN-dev/bt-food-front/main/public/promo-banner-02.png',
              }}
            />
          </View>
        </ScrollView>
      </View>

      {/* CATEGORIAS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categorias</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categorias.map((c) => (
            <TouchableOpacity key={c.id} style={styles.categoryCard}>
              <View style={styles.categoryImageContainer}>
                <Image 
                  source={{ uri: c.imagemUrl }} 
                  style={styles.categoryImage} 
                  resizeMode="cover" 
                />
              </View>
              <Text style={styles.categoryName}>{c.nome}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* LOJAS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Restaurantes</Text>
        
        {lojas.map((l) => (
          <TouchableOpacity
            key={l.idRestaurante}
            style={styles.restaurantCard}
            onPress={() =>
              navigation.navigate("ProdutosRestaurante", {
                id: l.idRestaurante,
              })
            }
            activeOpacity={0.7}
          >
            <Image
              style={styles.restaurantImage}
              resizeMode="cover"
              source={{
                uri: l.urlImagem
                  ? `http://localhost:8081${l.urlImagem.replace(/\\/g, "/")}`
                  : "https://via.placeholder.com/100"
              }}
            />
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{l.nome}</Text>
              <Text style={styles.restaurantDetails}>
                ⭐ 4.5 • 30-40 min • R$ 10,00
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  
  // SEÇÕES
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E2E2E',
    marginBottom: 16,
  },
  
  // PROMOÇÕES
  promoSection: {
    marginTop: 16,
    paddingLeft: 16,
  },
  promoScroll: {
    paddingRight: 16,
  },
  promoCard: {
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  promoImage: {
    width: 320,
    height: 160,
    backgroundColor: '#E0E0E0',
  },
  
  // CATEGORIAS
  categoriesScroll: {
    paddingRight: 16,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  categoryImageContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E2E2E',
    textAlign: 'center',
  },
  
  // RESTAURANTES
  restaurantCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E2E2E',
    marginBottom: 6,
  },
  restaurantDetails: {
    fontSize: 13,
    color: '#717171',
    lineHeight: 18,
  },
  
  bottomSpacing: {
    height: 24,
  },
});